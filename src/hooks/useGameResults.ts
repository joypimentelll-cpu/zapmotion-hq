import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Json } from '@/integrations/supabase/types';

interface GameAnswer {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}

interface SaveGameResultParams {
  score: number;
  totalQuestions: number;
  answers: GameAnswer[];
  timeSeconds: number;
}

export function useGameResults() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['game-results', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('game_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });
}

export function useSaveGameResult() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (params: SaveGameResultParams) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('game_results')
        .insert({
          user_id: user.id,
          score: params.score,
          total_questions: params.totalQuestions,
          answers: params.answers as unknown as Json,
          time_seconds: params.timeSeconds,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-results'] });
    },
  });
}
