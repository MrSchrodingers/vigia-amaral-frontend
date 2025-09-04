/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string
  email: string
  is_active: boolean
}

export interface NegotiationMessage {
  id: string
  sender: "client" | "agent" | string
  content: string
  timestamp: string
}

export interface EmailThread {
  id: string;
  subject: string | null;
  participants: string[];
  last_email_date: string;
}

export interface Negotiation {
  id: string
  status: "active" | "pending" | "resolved"
  priority: "high" | "medium" | "low"
  debt_value: number | null
  assigned_agent_id: string
  last_message: string | null
  last_message_time: string | null
  message_count: number
  client_name: string | null
  process_number: string | null
}

export interface NegotiationDetails extends Negotiation {
  messages: NegotiationMessage[];
  email_thread?: EmailThread;
}

export interface ProcessParty {
  id: string
  polo: "ATIVO" | "PASSIVO"
  name: string
  document_type: string | null
  document_number: string | null
  representatives: any[]
}

export interface ProcessDocument {
  id: string
  external_id: string | null
  name: string
  document_type: string | null
  juntada_date: string
  file_type: string | null
  file_size: number | null
}

export interface ProcessMovement {
  id: string
  date: string
  description: string
}

export interface LegalProcess {
  id: string
  process_number: string
  classe_processual: string | null
  assunto: string | null
  orgao_julgador: string | null
  status: string | null
  valor_causa: number | null
}

export interface LegalProcessDetails extends LegalProcess {
  movements: ProcessMovement[]
  parties: ProcessParty[]
  documents: ProcessDocument[]
  summary_content: string | null
  analysis_content: any | null
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

export interface ChatSession {
  id: string
  title: string
  created_at: string
  owner_id: string
  messages: ChatMessage[]
}

export interface ActionResponse<T> {
  status: "success" | "processing" | "error"
  message?: string
  data: T
}

export interface JusbrStatus {
  is_active: boolean
  message?: string
}
