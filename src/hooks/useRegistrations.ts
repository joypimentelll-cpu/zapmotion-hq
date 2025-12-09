import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Database } from '@/integrations/supabase/types';

type TrainingRegistration = Database['public']['Tables']['training_registrations']['Row'];
type InsertRegistration = Database['public']['Tables']['training_registrations']['Insert'];
type UpdateRegistration = Database['public']['Tables']['training_registrations']['Update'];

export function useUserRegistration() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-registration', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('training_registrations')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });
}

export function useAllRegistrations() {
  return useQuery({
    queryKey: ['all-registrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data as TrainingRegistration[];
    },
  });
}

export function useCreateRegistration() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (registration: Omit<InsertRegistration, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('training_registrations')
        .insert({
          ...registration,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log the action
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'create',
        entity_type: 'training_registration',
        entity_id: data.id,
        details: { registration: data },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-registration'] });
      queryClient.invalidateQueries({ queryKey: ['all-registrations'] });
    },
  });
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateRegistration & { id: string }) => {
      const { data, error } = await supabase
        .from('training_registrations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log the action
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'update',
          entity_type: 'training_registration',
          entity_id: id,
          details: { updates },
        });
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-registration'] });
      queryClient.invalidateQueries({ queryKey: ['all-registrations'] });
    },
  });
}

export function useDeleteRegistration() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // First get the registration for logging
      const { data: registration } = await supabase
        .from('training_registrations')
        .select('full_name')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('training_registrations')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Log the action
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'delete',
          entity_type: 'training_registration',
          entity_id: id,
          details: { deleted_name: registration?.full_name },
        });
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-registrations'] });
    },
  });
}
