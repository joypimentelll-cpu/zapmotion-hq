import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Json } from '@/integrations/supabase/types';

export function useAuditLogs() {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }

      return data;
    },
  });
}

export function useLogAction() {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({
      action,
      entityType,
      entityId,
      details,
    }: {
      action: string;
      entityType: string;
      entityId?: string;
      details?: Record<string, unknown>;
    }) => {
      const { error } = await supabase.from('audit_logs').insert([{
        user_id: user?.id ?? null,
        action,
        entity_type: entityType,
        entity_id: entityId ?? null,
        details: details as Json ?? null,
      }]);

      if (error) {
        throw error;
      }
    },
  });
}
