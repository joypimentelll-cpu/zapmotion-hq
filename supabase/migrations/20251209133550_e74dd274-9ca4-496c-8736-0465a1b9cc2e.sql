-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('participante', 'admin_rh');

-- Create enum for departments
CREATE TYPE public.department AS ENUM ('TI', 'RH', 'Marketing', 'Comercial', 'Financeiro', 'Outro');

-- Create enum for familiarity levels
CREATE TYPE public.familiarity_level AS ENUM ('Baixo', 'Medio', 'Alto');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- User roles policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" 
ON public.user_roles FOR SELECT 
USING (public.has_role(auth.uid(), 'admin_rh'));

-- Create training registrations table
CREATE TABLE public.training_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  corporate_email TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  department department NOT NULL,
  familiarity_level familiarity_level NOT NULL,
  needs_accessibility BOOLEAN NOT NULL DEFAULT false,
  accessibility_details TEXT,
  observations TEXT,
  participation_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on training_registrations
ALTER TABLE public.training_registrations ENABLE ROW LEVEL SECURITY;

-- Training registrations policies
CREATE POLICY "Users can view their own registrations" 
ON public.training_registrations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own registrations" 
ON public.training_registrations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations" 
ON public.training_registrations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all registrations" 
ON public.training_registrations FOR SELECT 
USING (public.has_role(auth.uid(), 'admin_rh'));

CREATE POLICY "Admins can update all registrations" 
ON public.training_registrations FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin_rh'));

CREATE POLICY "Admins can delete registrations" 
ON public.training_registrations FOR DELETE 
USING (public.has_role(auth.uid(), 'admin_rh'));

-- Create game results table
CREATE TABLE public.game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL,
  time_seconds INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on game_results
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;

-- Game results policies
CREATE POLICY "Users can view their own game results" 
ON public.game_results FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game results" 
ON public.game_results FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all game results" 
ON public.game_results FOR SELECT 
USING (public.has_role(auth.uid(), 'admin_rh'));

-- Create audit logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit logs policies (only admins can view)
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (public.has_role(auth.uid(), 'admin_rh'));

CREATE POLICY "System can insert audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (true);

-- Create available training dates table
CREATE TABLE public.training_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_date DATE NOT NULL UNIQUE,
  max_participants INTEGER NOT NULL DEFAULT 50,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on training_dates
ALTER TABLE public.training_dates ENABLE ROW LEVEL SECURITY;

-- Training dates policies (everyone can view active dates)
CREATE POLICY "Anyone can view active training dates" 
ON public.training_dates FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage training dates" 
ON public.training_dates FOR ALL 
USING (public.has_role(auth.uid(), 'admin_rh'));

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, employee_id, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(new.raw_user_meta_data ->> 'employee_id', ''),
    new.email
  );
  
  -- Assign default role as participante
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'participante');
  
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_registrations_updated_at
  BEFORE UPDATE ON public.training_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default training dates
INSERT INTO public.training_dates (training_date, max_participants) VALUES
  ('2025-01-15', 50),
  ('2025-01-22', 50),
  ('2025-01-29', 50),
  ('2025-02-05', 50),
  ('2025-02-12', 50),
  ('2025-02-19', 50),
  ('2025-02-26', 50),
  ('2025-03-05', 50);