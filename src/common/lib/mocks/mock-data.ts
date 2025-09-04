// Mock data for the Legal AI Platform

export interface Negotiation {
  id: string
  processNumber: string
  email: string
  clientName: string
  phone: string
  status: "active" | "pending" | "resolved"
  priority: "high" | "medium" | "low"
  lastMessage: string
  lastMessageTime: string
  messageCount: number
  hasResume: boolean
  hasAnalysis: boolean
  debt: number
  messages: NegotiationMessage[]
}

export interface NegotiationMessage {
  id: string
  sender: "client" | "agent"
  content: string
  timestamp: string
}

export interface LegalProcess {
  id: string
  number: string
  title: string
  court: string
  status: string
  priority: string
  plaintiff: string
  defendant: string
  value: number
  startDate: string
  lastUpdate: string
  lawyer: string
  hasDocuments: boolean
  hasResume: boolean
  hasAnalysis: boolean
  movements: ProcessMovement[]
  documents: ProcessDocument[]
}

export interface ProcessMovement {
  id: string
  date: string
  description: string
  type: string
  responsible: string
}

export interface ProcessDocument {
  id: string
  name: string
  type: string
  size: string
  date: string
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  lastActivity: Date
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  context?: string
  relatedProcess?: string
}

// Mock Negotiations Data
export const mockNegotiations: Negotiation[] = [
  {
    id: "1",
    processNumber: "1234567-89.2024.8.26.0100",
    email: "cliente1@empresa.com",
    clientName: "João Silva Santos",
    phone: "(11) 99999-9999",
    status: "active",
    priority: "high",
    lastMessage: "Proposta de acordo enviada para análise",
    lastMessageTime: "2024-01-15T10:30:00Z",
    messageCount: 12,
    hasResume: true,
    hasAnalysis: false,
    debt: 45000.5,
    messages: [
      {
        id: "m1",
        sender: "client",
        content: "Gostaria de negociar o valor da dívida",
        timestamp: "2024-01-15T09:00:00Z",
      },
      {
        id: "m2",
        sender: "agent",
        content: "Entendido. Vamos analisar as opções disponíveis para seu caso.",
        timestamp: "2024-01-15T09:15:00Z",
      },
      {
        id: "m3",
        sender: "client",
        content: "Posso pagar 60% do valor à vista",
        timestamp: "2024-01-15T10:00:00Z",
      },
      {
        id: "m4",
        sender: "agent",
        content: "Proposta de acordo enviada para análise",
        timestamp: "2024-01-15T10:30:00Z",
      },
    ],
  },
  {
    id: "2",
    processNumber: "9876543-21.2024.8.26.0200",
    email: "contato@empresa2.com.br",
    clientName: "Maria Oliveira Costa",
    phone: "(11) 88888-8888",
    status: "pending",
    priority: "medium",
    lastMessage: "Aguardando documentação complementar",
    lastMessageTime: "2024-01-14T16:45:00Z",
    messageCount: 8,
    hasResume: false,
    hasAnalysis: true,
    debt: 23750.0,
    messages: [
      {
        id: "m5",
        sender: "client",
        content: "Preciso renegociar os prazos de pagamento",
        timestamp: "2024-01-14T15:00:00Z",
      },
      {
        id: "m6",
        sender: "agent",
        content: "Para isso, precisaremos de alguns documentos. Pode enviar?",
        timestamp: "2024-01-14T15:30:00Z",
      },
      {
        id: "m7",
        sender: "client",
        content: "Claro, vou providenciar hoje mesmo",
        timestamp: "2024-01-14T16:00:00Z",
      },
      {
        id: "m8",
        sender: "agent",
        content: "Aguardando documentação complementar",
        timestamp: "2024-01-14T16:45:00Z",
      },
    ],
  },
  {
    id: "3",
    processNumber: "5555444-33.2024.8.26.0300",
    email: "financeiro@empresa3.com",
    clientName: "Carlos Roberto Lima",
    phone: "(11) 77777-7777",
    status: "resolved",
    priority: "low",
    lastMessage: "Acordo finalizado com sucesso",
    lastMessageTime: "2024-01-13T14:20:00Z",
    messageCount: 15,
    hasResume: true,
    hasAnalysis: true,
    debt: 12300.75,
    messages: [
      {
        id: "m9",
        sender: "client",
        content: "Aceito a proposta de parcelamento",
        timestamp: "2024-01-13T13:00:00Z",
      },
      {
        id: "m10",
        sender: "agent",
        content: "Perfeito! Vou preparar o termo de acordo",
        timestamp: "2024-01-13T13:30:00Z",
      },
      {
        id: "m11",
        sender: "agent",
        content: "Acordo finalizado com sucesso",
        timestamp: "2024-01-13T14:20:00Z",
      },
    ],
  },
  {
    id: "4",
    processNumber: "7777888-99.2024.8.26.0400",
    email: "juridico@empresa4.com.br",
    clientName: "Ana Paula Ferreira",
    phone: "(11) 66666-6666",
    status: "active",
    priority: "high",
    lastMessage: "Contraprosta apresentada pelo devedor",
    lastMessageTime: "2024-01-16T11:15:00Z",
    messageCount: 18,
    hasResume: true,
    hasAnalysis: true,
    debt: 78500.25,
    messages: [
      {
        id: "m12",
        sender: "client",
        content: "Recebi a notificação do processo. Gostaria de negociar.",
        timestamp: "2024-01-16T09:00:00Z",
      },
      {
        id: "m13",
        sender: "agent",
        content: "Ótimo! Vamos discutir as opções de pagamento disponíveis.",
        timestamp: "2024-01-16T09:30:00Z",
      },
      {
        id: "m14",
        sender: "client",
        content: "Posso oferecer 40% à vista e o restante em 12 parcelas",
        timestamp: "2024-01-16T10:45:00Z",
      },
      {
        id: "m15",
        sender: "agent",
        content: "Contraprosta apresentada pelo devedor",
        timestamp: "2024-01-16T11:15:00Z",
      },
    ],
  },
]

// Mock Legal Processes Data
export const mockLegalProcesses: LegalProcess[] = [
  {
    id: "1",
    number: "1234567-89.2024.8.26.0100",
    title: "Ação de Cobrança - Empresa ABC Ltda",
    court: "1ª Vara Cível - Foro Central",
    status: "Em andamento",
    priority: "Alta",
    plaintiff: "Banco XYZ S.A.",
    defendant: "Empresa ABC Ltda",
    value: 125000.5,
    startDate: "2024-01-10",
    lastUpdate: "2024-01-15T14:30:00Z",
    lawyer: "Dr. João Silva",
    hasDocuments: true,
    hasResume: false,
    hasAnalysis: true,
    movements: [
      {
        id: "m1",
        date: "2024-01-15T14:30:00Z",
        description: "Juntada de petição de contestação",
        type: "Petição",
        responsible: "Advogado da parte ré",
      },
      {
        id: "m2",
        date: "2024-01-12T10:15:00Z",
        description: "Citação realizada com sucesso",
        type: "Citação",
        responsible: "Oficial de Justiça",
      },
      {
        id: "m3",
        date: "2024-01-10T09:00:00Z",
        description: "Distribuição do processo",
        type: "Distribuição",
        responsible: "Sistema",
      },
    ],
    documents: [
      {
        id: "d1",
        name: "Petição Inicial",
        type: "PDF",
        size: "2.3 MB",
        date: "2024-01-10",
      },
      {
        id: "d2",
        name: "Contestação",
        type: "PDF",
        size: "1.8 MB",
        date: "2024-01-15",
      },
      {
        id: "d3",
        name: "Documentos Comprobatórios",
        type: "PDF",
        size: "4.1 MB",
        date: "2024-01-10",
      },
    ],
  },
  {
    id: "2",
    number: "9876543-21.2024.8.26.0200",
    title: "Execução de Título Extrajudicial - Maria Santos",
    court: "2ª Vara Cível - Foro Regional",
    status: "Suspenso",
    priority: "Média",
    plaintiff: "Financeira DEF S.A.",
    defendant: "Maria Santos Silva",
    value: 45750.25,
    startDate: "2023-11-20",
    lastUpdate: "2024-01-08T16:45:00Z",
    lawyer: "Dra. Ana Costa",
    hasDocuments: true,
    hasResume: true,
    hasAnalysis: false,
    movements: [
      {
        id: "m4",
        date: "2024-01-08T16:45:00Z",
        description: "Processo suspenso por acordo entre as partes",
        type: "Decisão",
        responsible: "Juiz",
      },
      {
        id: "m5",
        date: "2023-12-15T11:20:00Z",
        description: "Penhora de bens realizada",
        type: "Penhora",
        responsible: "Oficial de Justiça",
      },
      {
        id: "m6",
        date: "2023-11-20T14:00:00Z",
        description: "Distribuição da execução",
        type: "Distribuição",
        responsible: "Sistema",
      },
    ],
    documents: [
      {
        id: "d4",
        name: "Título Executivo",
        type: "PDF",
        size: "1.5 MB",
        date: "2023-11-20",
      },
      {
        id: "d5",
        name: "Auto de Penhora",
        type: "PDF",
        size: "2.1 MB",
        date: "2023-12-15",
      },
    ],
  },
  {
    id: "3",
    number: "5555444-33.2024.8.26.0300",
    title: "Monitória - Cobrança de Honorários",
    court: "3ª Vara Cível - Foro Central",
    status: "Finalizado",
    priority: "Baixa",
    plaintiff: "Escritório Advocacia GHI",
    defendant: "Carlos Roberto Lima",
    value: 15300.0,
    startDate: "2023-08-15",
    lastUpdate: "2024-01-05T13:10:00Z",
    lawyer: "Dr. Pedro Oliveira",
    hasDocuments: true,
    hasResume: true,
    hasAnalysis: true,
    movements: [
      {
        id: "m7",
        date: "2024-01-05T13:10:00Z",
        description: "Processo arquivado definitivamente",
        type: "Arquivamento",
        responsible: "Sistema",
      },
      {
        id: "m8",
        date: "2023-12-20T14:30:00Z",
        description: "Pagamento integral realizado",
        type: "Pagamento",
        responsible: "Devedor",
      },
      {
        id: "m9",
        date: "2023-09-10T16:20:00Z",
        description: "Embargos rejeitados",
        type: "Decisão",
        responsible: "Juiz",
      },
      {
        id: "m10",
        date: "2023-08-15T10:00:00Z",
        description: "Distribuição da ação monitória",
        type: "Distribuição",
        responsible: "Sistema",
      },
    ],
    documents: [
      {
        id: "d6",
        name: "Petição Monitória",
        type: "PDF",
        size: "1.2 MB",
        date: "2023-08-15",
      },
      {
        id: "d7",
        name: "Comprovante de Pagamento",
        type: "PDF",
        size: "0.8 MB",
        date: "2023-12-20",
      },
      {
        id: "d8",
        name: "Embargos do Devedor",
        type: "PDF",
        size: "1.9 MB",
        date: "2023-09-05",
      },
    ],
  },
  {
    id: "4",
    number: "1111222-33.2024.8.26.0500",
    title: "Ação de Despejo por Falta de Pagamento",
    court: "4ª Vara Cível - Foro Regional Sul",
    status: "Em andamento",
    priority: "Alta",
    plaintiff: "Imobiliária JKL Ltda",
    defendant: "Roberto Alves Pereira",
    value: 35600.8,
    startDate: "2024-01-05",
    lastUpdate: "2024-01-16T09:45:00Z",
    lawyer: "Dra. Carla Mendes",
    hasDocuments: true,
    hasResume: false,
    hasAnalysis: false,
    movements: [
      {
        id: "m11",
        date: "2024-01-16T09:45:00Z",
        description: "Audiência de conciliação designada",
        type: "Despacho",
        responsible: "Juiz",
      },
      {
        id: "m12",
        date: "2024-01-10T14:20:00Z",
        description: "Citação por edital publicada",
        type: "Citação",
        responsible: "Oficial de Justiça",
      },
      {
        id: "m13",
        date: "2024-01-05T11:30:00Z",
        description: "Distribuição da ação de despejo",
        type: "Distribuição",
        responsible: "Sistema",
      },
    ],
    documents: [
      {
        id: "d9",
        name: "Petição Inicial - Despejo",
        type: "PDF",
        size: "2.8 MB",
        date: "2024-01-05",
      },
      {
        id: "d10",
        name: "Contrato de Locação",
        type: "PDF",
        size: "1.4 MB",
        date: "2024-01-05",
      },
      {
        id: "d11",
        name: "Comprovantes de Débito",
        type: "PDF",
        size: "3.2 MB",
        date: "2024-01-05",
      },
    ],
  },
]

// Mock Chat Sessions Data
export const mockChatSessions: ChatSession[] = [
  {
    id: "1",
    title: "Análise do Processo 1234567-89",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Analise o processo 1234567-89.2024.8.26.0100 e me dê um resumo da situação atual",
        timestamp: new Date("2024-01-15T10:00:00Z"),
        relatedProcess: "1234567-89.2024.8.26.0100",
      },
      {
        id: "m2",
        role: "assistant",
        content:
          "Com base na análise do processo 1234567-89.2024.8.26.0100, trata-se de uma ação de cobrança movida pelo Banco XYZ S.A. contra a Empresa ABC Ltda no valor de R$ 125.000,50.\n\n**Situação Atual:**\n- Status: Em andamento\n- Última movimentação: Juntada de contestação (15/01/2024)\n- Citação realizada com sucesso\n\n**Pontos de Atenção:**\n- A contestação foi apresentada dentro do prazo\n- Necessário analisar os argumentos de defesa\n- Valor elevado justifica acompanhamento prioritário\n\n**Recomendações:**\n- Revisar a contestação apresentada\n- Preparar tréplica se necessário\n- Considerar possibilidade de acordo",
        timestamp: new Date("2024-01-15T10:01:30Z"),
        context: "Processo judicial",
        relatedProcess: "1234567-89.2024.8.26.0100",
      },
    ],
    createdAt: new Date("2024-01-15T10:00:00Z"),
    lastActivity: new Date("2024-01-15T10:01:30Z"),
  },
  {
    id: "2",
    title: "Estratégias de Negociação",
    messages: [
      {
        id: "m3",
        role: "user",
        content: "Quais são as melhores estratégias para negociar com devedores em processos de cobrança?",
        timestamp: new Date("2024-01-14T15:30:00Z"),
      },
      {
        id: "m4",
        role: "assistant",
        content:
          "Aqui estão as principais estratégias para negociação em processos de cobrança:\n\n**1. Análise do Perfil do Devedor**\n- Capacidade financeira atual\n- Histórico de pagamentos\n- Situação patrimonial\n\n**2. Estratégias de Abordagem**\n- Proposta de desconto para pagamento à vista\n- Parcelamento com entrada significativa\n- Acordo com garantias adicionais\n\n**3. Timing da Negociação**\n- Antes da citação (custos menores)\n- Após penhora (pressão maior)\n- Próximo a audiências importantes\n\n**4. Documentação**\n- Formalizar todos os acordos\n- Estabelecer consequências do descumprimento\n- Registrar no processo judicial\n\n**Dica:** Sempre considere os custos processuais e o tempo de tramitação ao avaliar propostas de acordo.",
        timestamp: new Date("2024-01-14T15:32:15Z"),
        context: "Estratégia legal",
      },
    ],
    createdAt: new Date("2024-01-14T15:30:00Z"),
    lastActivity: new Date("2024-01-14T15:32:15Z"),
  },
]

// Utility functions for data manipulation
export const getProcessByNumber = (processNumber: string): LegalProcess | undefined => {
  return mockLegalProcesses.find((process) => process.number === processNumber)
}

export const getNegotiationByProcess = (processNumber: string): Negotiation | undefined => {
  return mockNegotiations.find((negotiation) => negotiation.processNumber === processNumber)
}

export const getActiveNegotiations = (): Negotiation[] => {
  return mockNegotiations.filter((negotiation) => negotiation.status === "active")
}

export const getProcessesByStatus = (status: string): LegalProcess[] => {
  return mockLegalProcesses.filter((process) => process.status === status)
}

export const getProcessesByPriority = (priority: string): LegalProcess[] => {
  return mockLegalProcesses.filter((process) => process.priority === priority)
}

export const getTotalDebtValue = (): number => {
  return mockNegotiations.reduce((total, negotiation) => total + negotiation.debt, 0)
}

export const getProcessesCount = (): { total: number; active: number; suspended: number; finished: number } => {
  const total = mockLegalProcesses.length
  const active = mockLegalProcesses.filter((p) => p.status === "Em andamento").length
  const suspended = mockLegalProcesses.filter((p) => p.status === "Suspenso").length
  const finished = mockLegalProcesses.filter((p) => p.status === "Finalizado").length

  return { total, active, suspended, finished }
}
