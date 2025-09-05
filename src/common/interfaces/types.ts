// =========================
// Users / Auth
// =========================
export interface User {
  id: string
  email: string
  is_active: boolean
}

// =========================
export interface NegotiationMessage {
  id: string
  role: "client" | "agent"
  sender: string 
  content: string
  timestamp: string
}


// =========================
export interface EmailThread {
  id: string
  subject: string | null
  participants?: string[] | null
  first_email_date?: string | null
  last_email_date?: string | null
}

// =========================
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
  messages: NegotiationMessage[]
  email_thread?: EmailThread
}

// =========================
// Judicial / Process
// =========================
export interface CadastroReceita {
  numero: string
  tipo: "CPF" | "CNPJ" | string
}

export interface PartyRepresentative {
  nome: string
  tipoRepresentacao: string
  cadastroReceitaFederal?: CadastroReceita[]
  oab?: string
}

export interface ProcessParty {
  id: string
  polo: "ATIVO" | "PASSIVO"
  name: string
  document_type: string | null
  document_number: string | null
  representatives: PartyRepresentative[]
  ajg?: boolean
  sigilosa?: boolean
}

export interface ProcessDocument {
  id: string
  external_id: string | null
  name: string
  document_type: string | null
  juntada_date: string
  file_type: string | null
  file_size: number | null

  // Campos enriquecidos (quando disponíveis)
  sequence?: number | null
  secrecy_level?: "PUBLICO" | "RESTRITO" | "SIGILOSO" | string
  type_code?: number | null
  type_name?: string | null
  pages?: number | null
  text_size?: number | null
}

export interface ProcessMovement {
  id: string
  date: string
  description: string
}

export interface ProcessDistribution {
  id: string
  datetime: string
  orgao_julgador_id?: number | null
  orgao_julgador_nome?: string | null
}

export interface LegalProcess {
  id: string
  process_number: string
  classe_processual: string | null
  assunto: string | null
  orgao_julgador: string | null
  status: string | null
  valor_causa: number | null

  // Metadados de tribunal / instância (novos)
  tribunal?: string | null
  tribunal_nome?: string | null
  tribunal_segmento?: string | null
  tribunal_jtr?: string | null

  instance?: string | null
  degree_sigla?: string | null
  degree_nome?: string | null
  degree_numero?: number | null

  // Códigos/ids auxiliares (novos)
  classe_codigo?: number | null
  assunto_codigo?: number | null
  assunto_hierarquia?: string | null
  orgao_julgador_id?: number | null

  // Datas/flags (novos)
  start_date?: string | null
  last_update?: string | null
  distribuicao_first_datetime?: string | null
  permite_peticionar?: boolean
  ativo?: boolean
  secrecy_level?: number | null

  // Fonte de dados (novo)
  fonte_dados_codex_id?: number | null
}

export interface LegalProcessDetails extends LegalProcess {
  movements: ProcessMovement[]
  parties: ProcessParty[]
  documents: ProcessDocument[]
  distributions?: ProcessDistribution[]

  summary_content: string | null
  analysis_content: any | null // manter compatível no app; tipamos localmente abaixo
}

// =========================
// Chat
// =========================
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

// =========================
export interface ActionResponse<T> {
  status: "success" | "processing" | "error"
  message?: string
  data: T
}

export interface JusbrStatus {
  is_active: boolean
  message?: string
}

//////////////////////////////////////////////
// ======= LOCAL TYPES (Análise IA) ======= //
//////////////////////////////////////////////

export type AIAction = {
  estrategia?: string
  proxima_acao?: string
}

export type AIArbiter = {
  confidence_score?: number
  acao_recomendada?: AIAction
  racional_juridico?: string
  referencias?: string[]
  [k: string]: any
}

export type AIOpinion = {
  tese?: string
  pontos_fortes?: string[]
  pontos_fracos?: string[]
  faixa_acordo_recomendada?: string
  recomendacoes?: string[]
}

export type AIOpinions = {
  conservadora?: AIOpinion
  estrategica?: AIOpinion
}

export type AIInputs = {
  small_payload?: any
  timeline?: Array<{ data?: string; descricao?: string; tipo?: string; doc_ref?: string | null }>
  evidence_index?: {
    docs?: Record<
      string,
      {
        label?: string
        data?: string
        tipo?: string
        url?: string | null
      }
    >
    moves?: Array<{ data?: string; descricao?: string; tipo?: string; doc_ref?: string | null }>
  }
}

export type AIAnalysisContent = {
  generated_at?: string
  process_id?: string
  process_number?: string
  inputs?: AIInputs
  legal_context?: {
    tese_autora?: string
    tese_reu?: string
    pontos_controversos?: string[]
    provas_relevantes?: string[]
    riscos?: string[]
    oportunidades?: string[]
    marcos_procedimentais?: string[]
  }
  extractions?: {
    pedidos_autora?: string[]
    defesas_reu?: string[]
    valores_reclamados?: string[]
    valores_comprovados?: string[]
    precedentes_citados?: string[]
    prazos_pendentes?: string[]
  }
  summary?: {
    sumario_executivo?: string
    status_e_proximos_passos?: {
      status_atual?: string
      tarefas?: string[]
      riscos?: string[]
      oportunidades?: string[]
    }
  }
  summary_html?: string
  opinions?: AIOpinions
  arbiter?: AIArbiter

  // Alguns providers repetem no topo:
  confidence_score?: number
  acao_recomendada?: AIAction
  racional_juridico?: string

  raw_agent_outputs?: Record<string, any>
  [k: string]: any
}