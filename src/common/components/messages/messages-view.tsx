"use client"

import { useState, useMemo, useEffect } from "react"
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  Mail,
} from "lucide-react"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdownMenu"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { cn } from "../../utils/utils"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { ScrollArea } from "../ui/scroll-area"
import { Skeleton } from "../ui/skeleton"
import { useNegotiations } from "../../lib/hooks/useNegotiations"
import type { Negotiation, NegotiationDetails, NegotiationMessage } from "../../interfaces/types"
import { formatCurrency, formatDate } from "../shared/utils/shared_utils"

// --- SUBCOMPONENTES ---

const NegotiationListSkeleton = () => (
  <div className="p-2 space-y-2">
    {[...Array(8)].map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-3/4 mb-3" />
          <Skeleton className="h-3 w-1/2 mb-4" />
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
)

const NegotiationDetailsSkeleton = () => (
  <div className="flex-1 flex flex-col p-6">
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4 mb-4">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
    <Skeleton className="h-full w-full" />
  </div>
)

// --- COMPONENTE PRINCIPAL ---

export function MessagesView() {
  // --- GERENCIAMENTO DE ESTADO ---
  const [selectedNegotiationId, setSelectedNegotiationId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // --- BUSCA DE DADOS (HOOK CENTRALIZADO) ---
  const {
    negotiations,
    isLoadingList,
    negotiationDetails,
    isLoadingDetails
  } = useNegotiations(selectedNegotiationId)

  // --- EFEITOS ---
  // Seleciona a primeira negociação da lista quando os dados carregam pela primeira vez
  useEffect(() => {
    if (!selectedNegotiationId && negotiations && negotiations.length > 0) {
      setSelectedNegotiationId(negotiations[0].id)
    }
  }, [negotiations, selectedNegotiationId])

  // --- LÓGICA DE FILTRAGEM ---
  const filteredNegotiations = useMemo(() => {
    if (!negotiations) return []
    const search = searchTerm.toLowerCase()
    return negotiations.filter((neg) => {
      const matchesSearch =
        neg.client_name?.toLowerCase().includes(search) ||
        neg.process_number?.toLowerCase().includes(search)

      const matchesStatus = statusFilter === "all" || neg.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [negotiations, searchTerm, statusFilter])

  // --- FUNÇÕES AUXILIARES ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "resolved": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "low": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getClientEmail = (details: NegotiationDetails) => {
    if (!details.email_thread?.participants) return "N/A";
    return details.email_thread.participants.find(p =>
      p && !p.includes("amaralvasconcellos.com.br") && !p.includes("pavcob.com.br")
    ) || "N/A";
  }

  // --- LÓGICA DE RENDERIZAÇÃO ---
  return (
    <div className="flex h-full bg-background">
      {/* Coluna da Lista de Negociações */}
      <div className="w-1/3 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Negociações por E-mail</h3>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por cliente ou processo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-between bg-transparent">
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" />
                    Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[calc(33.33vw-2rem)]">
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>Ativo</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pendente</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("resolved")}>Resolvido</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <ScrollArea className="flex-1">
          {isLoadingList ? (
            <NegotiationListSkeleton />
          ) : (
            <div className="p-2">
              {filteredNegotiations.map((neg) => (
                <Card
                  key={neg.id}
                  className={cn(
                    "mb-2 cursor-pointer transition-colors hover:bg-accent/50",
                    selectedNegotiationId === neg.id && "ring-2 ring-primary",
                  )}
                  onClick={() => setSelectedNegotiationId(neg.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {neg.client_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "C"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="font-medium text-sm truncate">{neg.client_name}</p>
                          <p className="text-xs text-muted-foreground truncate">{neg.process_number}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge className={cn("text-xs", getStatusColor(neg.status))}>{neg.status}</Badge>
                        <Badge className={cn("text-xs", getPriorityColor(neg.priority))}>{neg.priority}</Badge>
                      </div>
                    </div>
                    <p className="text-sm my-2 line-clamp-2">{neg.last_message || "Nenhuma mensagem recente."}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {neg.last_message_time ? formatDate(neg.last_message_time) : "N/A"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {neg.message_count}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Coluna de Detalhes e Mensagens */}
      <div className="flex-1 flex flex-col">
        {isLoadingDetails && <NegotiationDetailsSkeleton />}
        {!isLoadingDetails && negotiationDetails && (
          <>
            <div className="p-6 border-b border-border bg-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      {negotiationDetails.client_name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{negotiationDetails.client_name}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {getClientEmail(negotiationDetails)}
                      </span>
                      {negotiationDetails.email_thread?.subject && (
                        <span className="truncate max-w-[40ch]">Assunto: {negotiationDetails.email_thread.subject}</span>
                      )}
                      {negotiationDetails.email_thread?.participants?.length ? (
                        <span className="truncate max-w-[50ch]">
                          Participantes: {negotiationDetails.email_thread.participants.join(", ")}
                        </span>
                      ) : null}
                      {negotiationDetails.message_count > 0 && (
                        <span>
                          Período: {formatDate(negotiationDetails.messages[0].timestamp)} – {formatDate(negotiationDetails.messages[negotiationDetails.messages.length - 1].timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={cn("text-sm", getStatusColor(negotiationDetails.status))}>
                    {negotiationDetails.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Processo</p>
                    <p className="font-mono text-sm">{negotiationDetails.process_number}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Valor da Dívida</p>
                    <p className="font-semibold text-lg text-primary">{formatCurrency(negotiationDetails.debt_value || 0)}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">Mensagens</p>
                    <p className="font-semibold text-lg">{negotiationDetails.message_count}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <ScrollArea className="flex-1 p-6 bg-muted/20">
              <div className="space-y-4">
                {negotiationDetails.messages.map((message: NegotiationMessage) => {
                  const isAgent = message.role === "agent"
                  return (
                    <div
                      key={message.id}
                      className={cn("flex gap-3", isAgent ? "justify-end" : "justify-start")}
                    >
                      {!isAgent && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {negotiationDetails.client_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "C"}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className={cn(
                        "max-w-[70%] rounded-lg p-3 text-sm",
                        isAgent ? "bg-primary text-primary-foreground" : "bg-background shadow-sm"
                      )}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <p className={cn("text-xs mt-2 text-right", isAgent ? "text-primary-foreground/70" : "text-muted-foreground")}>
                          {formatDate(message.timestamp)}
                        </p>
                      </div>

                      {isAgent && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs bg-primary text-primary-foreground">AV</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <Input placeholder="Digite sua resposta..." className="flex-1" />
                <Button>Enviar</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}