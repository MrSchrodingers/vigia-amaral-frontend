import type {
  LegalProcess as BaseLegalProcess,
  LegalProcessDetails as BaseLegalProcessDetails,
  AIAnalysisContent,
  ProcessDocument,
} from "../../interfaces/types"

export type PartyPolo = "ATIVO" | "PASSIVO"

export interface PartyLite {
  id?: string | number
  name: string
  polo: PartyPolo
  ajg?: boolean
  sigilosa?: boolean
}

export type GroupByOption = "processo" | "autor" 

export interface LegalProcessWithParties extends Omit<BaseLegalProcess, "parties"> {
  autor_nome?: string
  parties?: PartyLite[]
}

export interface LegalProcessDetails extends Omit<BaseLegalProcessDetails, "documents"> {
  analysis_content: AIAnalysisContent
  documents?: ProcessDocument[]
}

export type Representative = {
  nome?: string
  tipoRepresentacao?: string
  oab?: string
  cadastroReceitaFederal?: Array<{ tipo?: string; numero?: string }>
}