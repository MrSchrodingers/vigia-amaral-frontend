"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bot,
  Send,
  User,
  Trash2,
  Download,
  Copy,
  RefreshCw,
  MessageSquare,
  FileText,
  Scale,
  Clock,
  Loader2,
} from "lucide-react"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent } from "../ui/card"
import { cn } from "../../lib/utils"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Separator } from "../ui/separator"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  context?: string
  relatedProcess?: string
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  lastActivity: Date
}

// Mock chat sessions
const mockSessions: ChatSession[] = [
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

export function ChatView() {
  const [sessions, setSessions] = useState<ChatSession[]>(mockSessions)
  const [currentSession, setCurrentSession] = useState<ChatSession>(sessions[0])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [contextFilter, setContextFilter] = useState("all")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [currentSession.messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    // Add user message
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      lastActivity: new Date(),
    }

    setCurrentSession(updatedSession)
    setSessions(sessions.map((s) => (s.id === currentSession.id ? updatedSession : s)))
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        context: detectContext(inputMessage),
      }

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiResponse],
        lastActivity: new Date(),
      }

      setCurrentSession(finalSession)
      setSessions(sessions.map((s) => (s.id === currentSession.id ? finalSession : s)))
      setIsTyping(false)
    }, 2000)
  }

  const generateAIResponse = (message: string): string => {
    // Simple mock AI responses based on keywords
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("processo") && lowerMessage.includes("análise")) {
      return "Para analisar um processo judicial, preciso considerar diversos aspectos:\n\n**Aspectos Processuais:**\n- Fase atual do processo\n- Prazos em curso\n- Movimentações recentes\n\n**Aspectos Materiais:**\n- Valor da causa\n- Fundamentos jurídicos\n- Provas disponíveis\n\n**Recomendações:**\n- Acompanhar prazos processuais\n- Avaliar possibilidades de acordo\n- Considerar recursos se necessário\n\nPosso ajudar com algum aspecto específico?"
    }

    if (lowerMessage.includes("acordo") || lowerMessage.includes("negociação")) {
      return "Sobre acordos e negociações em processos judiciais:\n\n**Vantagens do Acordo:**\n- Redução de custos processuais\n- Celeridade na resolução\n- Controle sobre o resultado\n- Redução de riscos\n\n**Fatores a Considerar:**\n- Probabilidade de êxito na ação\n- Custos do processo vs. valor do acordo\n- Capacidade de pagamento do devedor\n- Tempo estimado para conclusão\n\n**Dica:** Sempre documente adequadamente os termos do acordo e suas consequências."
    }

    if (lowerMessage.includes("prazo") || lowerMessage.includes("tempo")) {
      return "Sobre prazos processuais:\n\n**Prazos Importantes:**\n- Contestação: 15 dias (processo comum)\n- Recurso de apelação: 15 dias\n- Embargos de declaração: 5 dias\n- Cumprimento de sentença: 15 dias para pagamento\n\n**Dicas:**\n- Sempre considere a contagem em dias úteis\n- Fique atento a feriados e recessos\n- Protocole com antecedência\n- Mantenha controle rigoroso de prazos\n\nPrecisa de informações sobre algum prazo específico?"
    }

    return "Entendo sua pergunta. Como assistente especializado em direito e negociações judiciais, posso ajudar com:\n\n• Análise de processos judiciais\n• Estratégias de negociação\n• Orientações sobre prazos processuais\n• Sugestões de acordos\n• Interpretação de movimentações processuais\n\nPoderia ser mais específico sobre o que precisa? Isso me ajudará a fornecer uma resposta mais direcionada."
  }

  const detectContext = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    if (lowerMessage.includes("processo")) return "Processo judicial"
    if (lowerMessage.includes("acordo") || lowerMessage.includes("negociação")) return "Negociação"
    if (lowerMessage.includes("prazo")) return "Prazo processual"
    return "Consulta geral"
  }

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "Nova Conversa",
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    }
    setSessions([newSession, ...sessions])
    setCurrentSession(newSession)
  }

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter((s) => s.id !== sessionId)
    setSessions(updatedSessions)
    if (currentSession.id === sessionId && updatedSessions.length > 0) {
      setCurrentSession(updatedSessions[0])
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const filteredMessages = currentSession.messages.filter((message) => {
    if (contextFilter === "all") return true
    return message.context === contextFilter
  })

  return (
    <div className="flex h-full">
      {/* Chat Sessions Sidebar */}
      <div className="w-80 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Chat com IA</h3>
            </div>
            <Button size="sm" onClick={createNewSession}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Nova
            </Button>
          </div>

          {/* Context Filter */}
          <Select value={contextFilter} onValueChange={setContextFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por contexto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os contextos</SelectItem>
              <SelectItem value="Processo judicial">Processos judiciais</SelectItem>
              <SelectItem value="Negociação">Negociações</SelectItem>
              <SelectItem value="Prazo processual">Prazos processuais</SelectItem>
              <SelectItem value="Consulta geral">Consultas gerais</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "mb-2 cursor-pointer transition-colors hover:bg-accent/50",
                  currentSession.id === session.id && "ring-2 ring-primary",
                )}
                onClick={() => setCurrentSession(session)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm line-clamp-2">{session.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(session.id)
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {session.messages.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(session.lastActivity)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">{currentSession.title}</h2>
              <p className="text-sm text-muted-foreground">
                Assistente IA especializado em direito e negociações judiciais
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Bot className="w-3 h-3" />
                Online
              </Badge>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentSession({ ...currentSession, messages: [] })}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Bem-vindo ao Chat IA Jurídico</h3>
              <p className="text-muted-foreground max-w-md">
                Sou seu assistente especializado em direito e negociações judiciais. Posso ajudar com análise de
                processos, estratégias de negociação e orientações jurídicas.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                <Card
                  className="p-3 cursor-pointer hover:bg-accent/50"
                  onClick={() => setInputMessage("Analise o processo 1234567-89.2024.8.26.0100")}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm">Analisar processo</span>
                  </div>
                </Card>
                <Card
                  className="p-3 cursor-pointer hover:bg-accent/50"
                  onClick={() => setInputMessage("Quais estratégias de negociação recomendam?")}
                >
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-primary" />
                    <span className="text-sm">Estratégias de negociação</span>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3", message.role === "assistant" ? "justify-start" : "justify-end")}
                >
                  {message.role === "assistant" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-4",
                      message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground",
                    )}
                  >
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs opacity-70">
                        <Clock className="w-3 h-3" />
                        {formatDate(message.timestamp)}
                        {message.context && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <Badge variant="outline" className="text-xs">
                              {message.context}
                            </Badge>
                          </>
                        )}
                        {message.relatedProcess && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="font-mono text-xs">{message.relatedProcess}</span>
                          </>
                        )}
                      </div>
                      {message.role === "assistant" && (
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-50 hover:opacity-100">
                          <Copy className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Analisando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Digite sua pergunta sobre processos, negociações ou direito..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
              disabled={isTyping}
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Este assistente é contextualizado com informações de processos e negociações do sistema.
          </p>
        </div>
      </div>
    </div>
  )
}
