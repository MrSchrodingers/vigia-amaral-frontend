"use client"

import { useState } from "react"
import {
  MessageSquare,
  FileText,
  Brain,
  MoreVertical,
  Search,
  Filter,
  Clock,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdownMenu"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { cn } from "../../utils/utils"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"

// Mock data for negotiations
const mockNegotiations = [
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
]

export function MessagesView() {
  const [selectedNegotiation, setSelectedNegotiation] = useState(mockNegotiations[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isGeneratingResume, setIsGeneratingResume] = useState(false)
  const [isGeneratingDecisions, setIsGeneratingDecisions] = useState(false)
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false)

  const filteredNegotiations = mockNegotiations.filter((negotiation) => {
    const matchesSearch =
      negotiation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      negotiation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      negotiation.processNumber.includes(searchTerm)

    const matchesStatus = statusFilter === "all" || negotiation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "resolved":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString))
  }

  const handleGenerateResume = async () => {
    setIsGeneratingResume(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGeneratingResume(false)
  }

  const handleGenerateDecisions = async () => {
    setIsGeneratingDecisions(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setIsGeneratingDecisions(false)
  }

  const handleGenerateAnalysis = async () => {
    setIsGeneratingAnalysis(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGeneratingAnalysis(false)
  }

  return (
    <div className="flex h-full">
      {/* Negotiations List */}
      <div className="w-1/3 border-r border-border bg-card">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Negociações Ativas</h3>
          </div>

          {/* Search and Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente, email ou processo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
                  <Filter className="w-4 h-4 mr-2" />
                  Status: {statusFilter === "all" ? "Todos" : statusFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>Ativo</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pendente</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>Resolvido</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredNegotiations.map((negotiation) => (
              <Card
                key={negotiation.id}
                className={cn(
                  "mb-2 cursor-pointer transition-colors hover:bg-accent/50",
                  selectedNegotiation.id === negotiation.id && "ring-2 ring-primary",
                )}
                onClick={() => setSelectedNegotiation(negotiation)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {negotiation.clientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{negotiation.clientName}</p>
                        <p className="text-xs text-muted-foreground">{negotiation.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={cn("text-xs", getStatusColor(negotiation.status))}>{negotiation.status}</Badge>
                      <Badge className={cn("text-xs", getPriorityColor(negotiation.priority))}>
                        {negotiation.priority}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">Processo: {negotiation.processNumber}</p>

                  <p className="text-sm mb-2 line-clamp-2">{negotiation.lastMessage}</p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(negotiation.lastMessageTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {negotiation.messageCount}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Message Detail View */}
      <div className="flex-1 flex flex-col">
        {selectedNegotiation && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-border bg-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {selectedNegotiation.clientName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedNegotiation.clientName}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {selectedNegotiation.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedNegotiation.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={cn("text-sm", getStatusColor(selectedNegotiation.status))}>
                    {selectedNegotiation.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Marcar como resolvido</DropdownMenuItem>
                      <DropdownMenuItem>Alterar prioridade</DropdownMenuItem>
                      <DropdownMenuItem>Exportar conversa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Process Info */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Processo</p>
                    <p className="font-mono text-sm">{selectedNegotiation.processNumber}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Valor da Dívida</p>
                    <p className="font-semibold text-lg text-primary">{formatCurrency(selectedNegotiation.debt)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Mensagens</p>
                    <p className="font-semibold text-lg">{selectedNegotiation.messageCount}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedNegotiation.hasResume ? "secondary" : "default"}
                  size="sm"
                  onClick={handleGenerateResume}
                  disabled={isGeneratingResume}
                >
                  {isGeneratingResume ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : selectedNegotiation.hasResume ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <FileText className="w-4 h-4 mr-2" />
                  )}
                  {selectedNegotiation.hasResume ? "Ver Resumo" : "Gerar Resumo"}
                </Button>

                <Button
                  variant={selectedNegotiation.hasAnalysis ? "secondary" : "default"}
                  size="sm"
                  onClick={handleGenerateDecisions}
                  disabled={isGeneratingDecisions}
                >
                  {isGeneratingDecisions ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4 mr-2" />
                  )}
                  Decisões Recomendadas
                </Button>

                <Button variant="outline" size="sm" onClick={handleGenerateAnalysis} disabled={isGeneratingAnalysis}>
                  {isGeneratingAnalysis ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-2" />
                  )}
                  Análise Completa
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {selectedNegotiation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-3", message.sender === "agent" ? "justify-end" : "justify-start")}
                  >
                    {message.sender === "client" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {selectedNegotiation.clientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg p-3",
                        message.sender === "agent" ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          message.sender === "agent" ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        {formatDate(message.timestamp)}
                      </p>
                    </div>

                    {message.sender === "agent" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-primary text-primary-foreground">IA</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input placeholder="Digite sua mensagem..." className="flex-1" />
                <Button>Enviar</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
