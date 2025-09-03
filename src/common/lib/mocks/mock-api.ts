// Mock API functions to simulate backend integration

import {
  mockNegotiations,
  mockLegalProcesses,
  mockChatSessions,
  type Negotiation,
  type LegalProcess,
  type ChatSession,
  type ChatMessage,
  type NegotiationMessage,
} from "./mock-data"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Negotiations API
export const negotiationsAPI = {
  async getAll(): Promise<Negotiation[]> {
    await delay(500)
    return [...mockNegotiations]
  },

  async getById(id: string): Promise<Negotiation | null> {
    await delay(300)
    return mockNegotiations.find((n) => n.id === id) || null
  },

  async sendMessage(negotiationId: string, message: string): Promise<NegotiationMessage> {
    await delay(800)
    const newMessage: NegotiationMessage = {
      id: `msg-${Date.now()}`,
      sender: "agent",
      content: message,
      timestamp: new Date().toISOString(),
    }

    // In a real app, this would update the backend
    const negotiation = mockNegotiations.find((n) => n.id === negotiationId)
    if (negotiation) {
      negotiation.messages.push(newMessage)
      negotiation.lastMessage = message
      negotiation.lastMessageTime = newMessage.timestamp
      negotiation.messageCount++
    }

    return newMessage
  },

  async generateResume(negotiationId: string): Promise<{ success: boolean; resume?: string }> {
    await delay(2000)

    const negotiation = mockNegotiations.find((n) => n.id === negotiationId)
    if (!negotiation) {
      return { success: false }
    }

    const resume = `**Resumo da Negociação - ${negotiation.clientName}**

**Processo:** ${negotiation.processNumber}
**Valor da Dívida:** R$ ${negotiation.debt.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
**Status:** ${negotiation.status}
**Prioridade:** ${negotiation.priority}

**Histórico de Mensagens:**
- Total de ${negotiation.messageCount} mensagens trocadas
- Última interação: ${new Date(negotiation.lastMessageTime).toLocaleDateString("pt-BR")}

**Situação Atual:**
${negotiation.lastMessage}

**Recomendações:**
- Acompanhar resposta do cliente
- Considerar proposta de desconto para pagamento à vista
- Manter comunicação ativa para evitar inadimplência`

    // Mark as having resume
    negotiation.hasResume = true

    return { success: true, resume }
  },

  async generateDecisions(negotiationId: string): Promise<{ success: boolean; decisions?: string[] }> {
    await delay(2500)

    const negotiation = mockNegotiations.find((n) => n.id === negotiationId)
    if (!negotiation) {
      return { success: false }
    }

    const decisions = [
      "Oferecer desconto de 15% para pagamento à vista",
      "Propor parcelamento em até 12x com entrada de 30%",
      "Solicitar garantidor para valores acima de R$ 20.000",
      "Considerar suspensão de juros para acordos rápidos",
      "Avaliar capacidade de pagamento através de consulta ao Serasa",
    ]

    return { success: true, decisions }
  },

  async generateAnalysis(negotiationId: string): Promise<{ success: boolean; analysis?: string }> {
    await delay(3000)

    const negotiation = mockNegotiations.find((n) => n.id === negotiationId)
    if (!negotiation) {
      return { success: false }
    }

    const analysis = `**Análise Completa - ${negotiation.clientName}**

**Perfil do Devedor:**
- Cliente com histórico de comunicação ativa
- Demonstra interesse em negociação
- Valor da dívida: R$ ${negotiation.debt.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}

**Análise de Risco:**
- Risco: ${negotiation.priority === "high" ? "Alto" : negotiation.priority === "medium" ? "Médio" : "Baixo"}
- Probabilidade de acordo: ${negotiation.status === "active" ? "75%" : negotiation.status === "pending" ? "50%" : "90%"}

**Estratégia Recomendada:**
1. Manter comunicação frequente
2. Oferecer condições flexíveis de pagamento
3. Documentar todas as tratativas
4. Estabelecer prazos claros para resposta

**Próximos Passos:**
- Aguardar retorno do cliente
- Preparar minuta de acordo
- Agendar reunião se necessário`

    // Mark as having analysis
    negotiation.hasAnalysis = true

    return { success: true, analysis }
  },
}

// Legal Processes API
export const processesAPI = {
  async getAll(): Promise<LegalProcess[]> {
    await delay(600)
    return [...mockLegalProcesses]
  },

  async getById(id: string): Promise<LegalProcess | null> {
    await delay(400)
    return mockLegalProcesses.find((p) => p.id === id) || null
  },

  async searchByNumber(processNumber: string): Promise<LegalProcess[]> {
    await delay(800)
    return mockLegalProcesses.filter(
      (p) => p.number.includes(processNumber) || p.title.toLowerCase().includes(processNumber.toLowerCase()),
    )
  },

  async generateResume(processId: string): Promise<{ success: boolean; resume?: string }> {
    await delay(2500)

    const process = mockLegalProcesses.find((p) => p.id === processId)
    if (!process) {
      return { success: false }
    }

    const resume = `**Resumo do Processo ${process.number}**

**Dados Básicos:**
- Título: ${process.title}
- Vara: ${process.court}
- Valor da Causa: R$ ${process.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
- Status: ${process.status}

**Partes:**
- Autor: ${process.plaintiff}
- Réu: ${process.defendant}
- Advogado: ${process.lawyer}

**Movimentações Recentes:**
${process.movements
  .slice(0, 3)
  .map((m) => `- ${m.description} (${new Date(m.date).toLocaleDateString("pt-BR")})`)
  .join("\n")}

**Documentos:**
- Total de ${process.documents.length} documentos anexados
- Última atualização: ${new Date(process.lastUpdate).toLocaleDateString("pt-BR")}

**Situação Atual:**
O processo encontra-se ${process.status.toLowerCase()} com prioridade ${process.priority.toLowerCase()}.`

    // Mark as having resume
    process.hasResume = true

    return { success: true, resume }
  },

  async generatePDF(processId: string): Promise<{ success: boolean; url?: string }> {
    await delay(2000)

    const process = mockLegalProcesses.find((p) => p.id === processId)
    if (!process) {
      return { success: false }
    }

    // Simulate PDF generation
    const pdfUrl = `/api/processes/${processId}/pdf`

    return { success: true, url: pdfUrl }
  },

  async runAIAnalysis(processId: string): Promise<{ success: boolean; analysis?: string }> {
    await delay(3000)

    const process = mockLegalProcesses.find((p) => p.id === processId)
    if (!process) {
      return { success: false }
    }

    const analysis = `**Análise de IA - Processo ${process.number}**

**Análise Processual:**
- Fase atual: ${process.status}
- Tempo de tramitação: ${Math.floor((new Date().getTime() - new Date(process.startDate).getTime()) / (1000 * 60 * 60 * 24))} dias
- Complexidade: ${process.priority === "Alta" ? "Elevada" : "Moderada"}

**Probabilidade de Êxito:**
- Baseado no histórico: ${process.status === "Em andamento" ? "70%" : process.status === "Suspenso" ? "45%" : "95%"}
- Fatores favoráveis: Documentação completa, citação regular
- Riscos identificados: ${process.priority === "Alta" ? "Valor elevado, possível recurso" : "Baixo risco processual"}

**Recomendações Estratégicas:**
1. ${process.status === "Em andamento" ? "Acompanhar prazos de contestação" : "Monitorar cumprimento do acordo"}
2. Considerar proposta de acordo extrajudicial
3. Manter documentação atualizada
4. Avaliar necessidade de perícia técnica

**Próximas Ações Sugeridas:**
- Verificar cumprimento de prazos
- Analisar jurisprudência similar
- Preparar estratégia de audiência`

    // Mark as having analysis
    process.hasAnalysis = true

    return { success: true, analysis }
  },
}

// Chat API
export const chatAPI = {
  async getSessions(): Promise<ChatSession[]> {
    await delay(400)
    return [...mockChatSessions]
  },

  async createSession(title = "Nova Conversa"): Promise<ChatSession> {
    await delay(300)

    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    }

    mockChatSessions.unshift(newSession)
    return newSession
  },

  async sendMessage(sessionId: string, message: string): Promise<ChatMessage> {
    await delay(1500)

    const session = mockChatSessions.find((s) => s.id === sessionId)
    if (!session) {
      throw new Error("Session not found")
    }

    // Generate AI response based on message content
    const aiResponse = generateAIResponse(message)

    const responseMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "assistant",
      content: aiResponse.content,
      timestamp: new Date(),
      context: aiResponse.context,
      relatedProcess: aiResponse.relatedProcess,
    }

    session.messages.push(responseMessage)
    session.lastActivity = new Date()

    return responseMessage
  },

  async deleteSession(sessionId: string): Promise<boolean> {
    await delay(200)

    const index = mockChatSessions.findIndex((s) => s.id === sessionId)
    if (index > -1) {
      mockChatSessions.splice(index, 1)
      return true
    }
    return false
  },
}

// AI Response Generator
function generateAIResponse(message: string): { content: string; context?: string; relatedProcess?: string } {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("processo") && /\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/.test(message)) {
    const processNumber = message.match(/\d{7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/)?.[0]
    return {
      content: `Analisando o processo ${processNumber}...\n\nCom base nos dados disponíveis, este processo apresenta as seguintes características:\n\n**Status Atual:** Em tramitação\n**Valor:** Consulte os detalhes na aba de processos\n**Recomendações:** Acompanhar movimentações e considerar possibilidades de acordo\n\nPosso ajudar com algum aspecto específico deste processo?`,
      context: "Processo judicial",
      relatedProcess: processNumber,
    }
  }

  if (lowerMessage.includes("acordo") || lowerMessage.includes("negociação")) {
    return {
      content:
        "Sobre estratégias de acordo e negociação:\n\n**Fatores Importantes:**\n• Capacidade de pagamento do devedor\n• Valor original vs. custos processuais\n• Tempo estimado para conclusão do processo\n• Histórico de cumprimento de acordos\n\n**Estratégias Recomendadas:**\n• Desconto para pagamento à vista\n• Parcelamento com entrada substancial\n• Garantias adicionais para valores elevados\n\n**Documentação:**\n• Formalizar todos os termos\n• Estabelecer consequências do descumprimento\n• Registrar no sistema processual\n\nQual aspecto específico da negociação você gostaria de discutir?",
      context: "Negociação",
    }
  }

  if (lowerMessage.includes("prazo") || lowerMessage.includes("tempo")) {
    return {
      content:
        "Informações sobre prazos processuais:\n\n**Prazos Fundamentais:**\n• Contestação: 15 dias (processo comum)\n• Apelação: 15 dias da intimação\n• Embargos de declaração: 5 dias\n• Cumprimento de sentença: 15 dias para pagamento voluntário\n\n**Dicas Importantes:**\n• Contagem em dias úteis (exceto quando especificado)\n• Atenção a feriados forenses\n• Protocolo com antecedência\n• Controle rigoroso de prazos\n\n**Ferramentas de Controle:**\n• Agenda processual\n• Alertas automáticos\n• Backup de intimações\n\nPrecisa de informações sobre algum prazo específico?",
      context: "Prazo processual",
    }
  }

  return {
    content:
      "Como assistente jurídico especializado, posso ajudar com:\n\n🔍 **Análise de Processos**\n• Interpretação de movimentações\n• Avaliação de riscos e oportunidades\n• Sugestões estratégicas\n\n💼 **Negociações**\n• Estratégias de acordo\n• Cálculos de proposta\n• Documentação de tratativas\n\n⏰ **Gestão Processual**\n• Controle de prazos\n• Acompanhamento de fases\n• Orientações procedimentais\n\n📊 **Relatórios e Análises**\n• Resumos executivos\n• Indicadores de performance\n• Projeções de resultados\n\nComo posso ajudar especificamente hoje?",
    context: "Consulta geral",
  }
}

// Dashboard Statistics API
export const dashboardAPI = {
  async getStatistics(): Promise<{
    totalProcesses: number
    activeNegotiations: number
    totalDebtValue: number
    successRate: number
    monthlyStats: Array<{ month: string; processes: number; negotiations: number; agreements: number }>
  }> {
    await delay(800)

    const totalProcesses = mockLegalProcesses.length
    const activeNegotiations = mockNegotiations.filter((n) => n.status === "active").length
    const totalDebtValue = mockNegotiations.reduce((sum, n) => sum + n.debt, 0)
    const resolvedNegotiations = mockNegotiations.filter((n) => n.status === "resolved").length
    const successRate = Math.round((resolvedNegotiations / mockNegotiations.length) * 100)

    const monthlyStats = [
      { month: "Jan", processes: 12, negotiations: 8, agreements: 5 },
      { month: "Fev", processes: 15, negotiations: 12, agreements: 8 },
      { month: "Mar", processes: 18, negotiations: 15, agreements: 10 },
      { month: "Abr", processes: 22, negotiations: 18, agreements: 12 },
      { month: "Mai", processes: 25, negotiations: 20, agreements: 15 },
      { month: "Jun", processes: 28, negotiations: 22, agreements: 18 },
    ]

    return {
      totalProcesses,
      activeNegotiations,
      totalDebtValue,
      successRate,
      monthlyStats,
    }
  },
}
