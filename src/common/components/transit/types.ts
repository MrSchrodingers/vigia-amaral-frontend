export interface TransitAnalysis {
  id: string;
  process_id: string;
  status: string;
  justification?: string;
  key_movements?: string[]; 
  transit_date?: string | null;
  analysis_raw_data?: any;
  created_at: string;
  updated_at: string;
  process?: {
    id: string;
    process_number: string;
    classe_processual: string;
    assunto: string;
    valor_causa?: number;
    tribunal_nome?: string;
    degree_nome?: string;
  };
}

export interface CalendarDay {
  date: Date;
  cases: TransitAnalysis[];
  isCurrentMonth: boolean;
  isToday: boolean;
}