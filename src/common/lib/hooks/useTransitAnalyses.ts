import { useQuery } from "@tanstack/react-query";
import api from "../../services/api.service";
import type { TransitAnalysis } from "../../components/transit/types";

interface TransitAnalysesFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  limit?: number;
}

const fetchTransitAnalyses = async (filters: TransitAnalysesFilters): Promise<TransitAnalysis[]> => {
  const params = new URLSearchParams();

  if (filters.status && filters.status !== "all") {
    params.append("status", filters.status);
  }
  if (filters.startDate) {
    params.append("start_date", filters.startDate);
  }
  if (filters.endDate) {
    params.append("end_date", filters.endDate);
  }
  params.append("skip", String(filters.skip || 0));
  params.append("limit", String(filters.limit || 100));

  const { data } = await api.get(`/proccess-analyses?${params.toString()}`);
  return data;
};

export const useTransitAnalyses = (filters: TransitAnalysesFilters) => {
  return useQuery<TransitAnalysis[]>({
    queryKey: ["proccess-analyses", filters],
    queryFn: () => fetchTransitAnalyses(filters),
  });
};