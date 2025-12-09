import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface TrainingDate {
  id: string;
  training_date: string;
  max_participants: number;
  is_active: boolean;
}

export function useTrainingDates() {
  return useQuery({
    queryKey: ['training-dates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_dates')
        .select('*')
        .eq('is_active', true)
        .order('training_date', { ascending: true });

      if (error) {
        throw error;
      }

      return data as TrainingDate[];
    },
  });
}
