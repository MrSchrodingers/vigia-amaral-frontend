import { useQuery } from "@tanstack/react-query"
import type { Negotiation, NegotiationDetails } from "@/src/common/interfaces/types"
import api from "@/src/common/services/api.service"

// As funções de busca permanecem as mesmas
const fetchNegotiations = async (): Promise<Negotiation[]> => {
  const { data } = await api.get("/negotiations/")
  return data
}

const fetchNegotiationDetails = async (negotiationId: string): Promise<NegotiationDetails> => {
  const { data } = await api.get(`/negotiations/${negotiationId}`)
  return data
}

// O hook agora aceita um ID opcional para buscar os detalhes
export function useNegotiations(negotiationId: string | null) {
  // Query para a lista de negociações
  const { data: negotiations, isLoading: isLoadingList } = useQuery<Negotiation[], Error>({
    queryKey: ["negotiations"],
    queryFn: fetchNegotiations,
  })

  // Query para os detalhes da negociação SELECIONADA
  const { data: negotiationDetails, isLoading: isLoadingDetails } = useQuery<NegotiationDetails, Error>({
    queryKey: ["negotiationDetails", negotiationId],
    queryFn: () => fetchNegotiationDetails(negotiationId!),
    enabled: !!negotiationId, // Só busca se negotiationId não for nulo
  })

  return {
    negotiations,
    isLoadingList,
    negotiationDetails,
    isLoadingDetails,
  }
}