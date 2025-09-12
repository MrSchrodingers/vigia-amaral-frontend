/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ActionResponse, LegalProcess, LegalProcessDetails } from "@/src/common/interfaces/types";
import api from "@/src/common/services/api.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const fetchProcesses = async (): Promise<LegalProcess[]> => {
  const { data } = await api.get('/processes/');
  return data;
};

const syncProcess = async (processNumber: string): Promise<LegalProcessDetails[]> => { 
  const { data } = await api.post(`/processes/sync/${processNumber}`)
  return data
};

const fetchProcesseDetail = async (processNumber: string): Promise<LegalProcessDetails> => {
  const { data } = await api.get(`/processes/${processNumber}`);
  return data;
};

const runAIJury = async (processId: string): Promise<ActionResponse<any>> => {
  const { data } = await api.post(`/actions/processes/${processId}/run-ai-jury`);
  return data;
};

export function useProcesses() {
  const queryClient = useQueryClient();

  const { data: processes, isLoading, error } = useQuery<LegalProcess[], Error>({
    queryKey: ['processes'],
    queryFn: fetchProcesses,
  });

  const syncProcessMutation = useMutation<LegalProcessDetails[], Error, string>({
    mutationFn: syncProcess,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["processes"] })

      if (data && data.length > 0) {
        data.forEach((processDetail) => {
          queryClient.setQueryData(["process", processDetail.id], processDetail)
        })
      }
    },
  })


  const syncProcessDetailMutation = useMutation<LegalProcessDetails, Error, string>({
    mutationFn: fetchProcesseDetail,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['processes-detail'] });
      queryClient.setQueryData(['process-detail', data.id], data);
    },
  });
  
  const runAIJuryMutation = useMutation<ActionResponse<any>, Error, string>({
    mutationFn: runAIJury,
    onSuccess: (response, processId) => {
        // Invalida os detalhes do processo para que a nova análise seja buscada
        queryClient.invalidateQueries({ queryKey: ['process', processId] });
    }
  });

  return { 
    processes, 
    isLoading, 
    error,
    syncProcess: syncProcessMutation.mutate,
    isSyncing: syncProcessMutation.isPending,
    runAIJury: runAIJuryMutation.mutate,
    isAnalyzing: runAIJuryMutation.isPending,
    syncDetail: syncProcessDetailMutation.mutate
  };
}