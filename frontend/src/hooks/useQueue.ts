import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api/api.client';
import { QueueEntry } from '../types';

export const useQueue = () => {
  const queryClient = useQueryClient();

  const queueQuery = useQuery({
    queryKey: ['queue'],
    queryFn: async () => {
      const { data } = await apiClient.get<QueueEntry[]>('/queue');
      return data;
    },
  });

  const joinQueueMutation = useMutation({
    mutationFn: async (entry: Partial<QueueEntry>) => {
      const { data } = await apiClient.post('/queue/join', entry);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queue'] });
    },
  });

  return {
    queue: queueQuery.data || [],
    isLoading: queueQuery.isLoading,
    joinQueue: joinQueueMutation.mutate,
  };
};