import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api.service";
import type { ActionResponse, JusbrStatus } from "../../interfaces/types";

// --- Funções de API ---

const fetchJusbrStatus = async (): Promise<JusbrStatus> => {
  const { data } = await api.get("/system/jusbr-status");
  return data;
};

const triggerJusbrLogin = async (): Promise<JusbrStatus> => {
  const { data } = await api.post("/system/jusbr-login");
  return data;
};

const triggerEmailSync = async (): Promise<ActionResponse<null>> => {
  const { data } = await api.post("/system/sync-emails");
  return data;
};


// --- Hook Customizado ---
export function useSystem() {
  const queryClient = useQueryClient();

  // Query para buscar o status do Jus.br
  const { data: jusbrStatus, isLoading: isCheckingStatus } = useQuery<JusbrStatus, Error>({
    queryKey: ['jusbr-status'],
    queryFn: fetchJusbrStatus,
    // Verifica o status a cada 30 segundos em background
    refetchInterval: 30000, 
    // Evita refetchs desnecessários ao focar na janela
    staleTime: 15000, 
  });

  // Mutation para disparar o processo de login
  const { mutate: refreshLogin, isPending: isRefreshingLogin } = useMutation<JusbrStatus, Error>({
    mutationFn: triggerJusbrLogin,
    onSuccess: () => {
      // Após disparar, invalidamos a query de status.
      // O refetchInterval irá eventualmente pegar o novo status "ativo".
      // Isso dá um feedback imediato de que a ação foi iniciada.
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['jusbr-status'] });
      }, 5000); // Aguarda 5s antes da primeira tentativa de revalidação
    },
  });

  // Mutation para disparar a sincronização de e-mails
  const { mutate: syncEmails, isPending: isSyncingEmails } = useMutation<ActionResponse<null>, Error>({
    mutationFn: triggerEmailSync,
    onSuccess: () => {
      console.log("Sincronização de e-mails iniciada com sucesso.");
    },
  });

  return {
    jusbrStatus,
    isCheckingStatus,
    refreshLogin,
    isRefreshingLogin,
    syncEmails,
    isSyncingEmails,
  };
}