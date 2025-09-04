"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Search,
  FileText,
  Download,
  Brain,
  Loader2,
  Gavel,
  Scale,
  ShieldAlert,
  Calendar,
  Building,
  Users,
  Eye,
  Filter,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react"

import type { LegalProcess, LegalProcessDetails, ProcessDocument } from "../../interfaces/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { ScrollArea } from "../ui/scroll-area"
import { cn } from "../../utils/utils"
import { Badge } from "../ui/badge"
import { formatCurrency, formatDate, formatDateShort } from "../shared/utils/shared_utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Button } from "../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Progress } from "../ui/progress"
import { Input } from "../ui/input"
import { Separator } from "../ui/separator"
import { useProcesses } from "../../lib/hooks/useProcesses"
import api from "../../services/api.service"

// ============================================================================
// SUBCOMPONENTE: ProcessList (Lista de Processos)
// ============================================================================
const ProcessList = ({
  processes,
  isLoading,
  onSelectProcess,
  selectedProcessId,
  filterTerm,
}: {
  processes: LegalProcess[] | undefined
  isLoading: boolean
  onSelectProcess: (process: LegalProcess) => void
  selectedProcessId: string | null
  filterTerm: string
}) => {
  const filteredProcesses = useMemo(() => {
    if (!processes) return []
    const term = filterTerm.toLowerCase()
    return processes.filter(
      (p) =>
        p.process_number.toLowerCase().includes(term) ||
        p.classe_processual?.toLowerCase().includes(term) ||
        p.assunto?.toLowerCase().includes(term),
    )
  }, [processes, filterTerm])

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-3" />
              <Skeleton className="h-3 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (filteredProcesses.length === 0) {
    return (
      <div className="p-6 text-center">
        <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          {filterTerm ? "Nenhum processo encontrado." : "Nenhum processo na base."}
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-3">
        {filteredProcesses.map((process) => (
          <Card
            key={process.id}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md border-l-4",
              selectedProcessId === process.id
                ? "ring-2 ring-primary border-l-primary bg-primary/5"
                : "border-l-transparent hover:border-l-primary/50",
            )}
            onClick={() => onSelectProcess(process)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-semibold text-primary truncate">{process.process_number}</p>
                  <p className="text-sm font-medium text-foreground line-clamp-2 mt-1">
                    {process.classe_processual || "Classe não definida"}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Building className="w-3 h-3" />
                  <span className="truncate">{process.orgao_julgador}</span>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {process.status || "Status indefinido"}
                  </Badge>
                  <span className="text-sm font-semibold text-primary">{formatCurrency(process.valor_causa ?? 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}

// ============================================================================
// SUBCOMPONENTE: ProcessDetails (Detalhes do Processo)
// ============================================================================
const ProcessDetails = ({
  process,
  onRunAIJury,
  isAnalyzing,
}: {
  process: LegalProcessDetails
  onRunAIJury: () => void
  isAnalyzing: boolean
}) => {
  const handleDownload = async (doc: ProcessDocument) => {
    try {
      const response = await api.get(`/processes/${process.id}/documents/${doc.id}/download`, {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", doc.name)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
      // Adicionar notificação de erro para o usuário (ex: react-hot-toast)
    }
  }

  const getPartyByType = (polo: "ATIVO" | "PASSIVO") => process.parties.find((p) => p.polo === polo)

  const getStatusIcon = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "em andamento":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "finalizado":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "suspenso":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  // O resto do componente ProcessDetails continua exatamente como você projetou...
  // A função handleDownload acima é a única parte que precisava de implementação.
  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Header (sem alterações) */}
        <div className="p-6 border-b bg-card/50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Gavel className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{process.classe_processual}</h1>
              </div>
              <p className="font-mono text-sm text-muted-foreground mb-1">{process.process_number}</p>
              <p className="text-sm text-muted-foreground">{process.assunto}</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(process.status)}
              <Badge variant="outline" className="font-medium">
                {process.status || "Status indefinido"}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <p className="text-xs font-medium text-muted-foreground">AUTOR</p>
                </div>
                <p className="font-semibold text-sm text-foreground truncate">{getPartyByType("ATIVO")?.name || "N/A"}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <p className="text-xs font-medium text-muted-foreground">RÉU</p>
                </div>
                <p className="font-semibold text-sm text-foreground truncate">{getPartyByType("PASSIVO")?.name || "N/A"}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Scale className="w-4 h-4 text-green-500" />
                  <p className="text-xs font-medium text-muted-foreground">VALOR DA CAUSA</p>
                </div>
                <p className="font-bold text-sm text-primary">{formatCurrency(process.valor_causa ?? 0)}</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-4 h-4 text-purple-500" />
                  <p className="text-xs font-medium text-muted-foreground">ÓRGÃO JULGADOR</p>
                </div>
                <p className="font-semibold text-sm text-foreground truncate">{process.orgao_julgador || "N/A"}</p>
              </CardContent>
            </Card>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onRunAIJury} disabled={isAnalyzing} className="flex items-center gap-2">
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              {isAnalyzing ? "Analisando..." : "Análise com IA"}
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Visualizar Completo
            </Button>
          </div>
        </div>

        {/* Tabs (sem alterações) */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="movements">Movimentações</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
                <TabsTrigger value="parties">Partes</TabsTrigger>
                <TabsTrigger value="analysis">Análise IA</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-6">
                  {process.summary_content && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Resumo do Processo
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">{process.summary_content}</p>
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Atividade Recente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {process.movements.slice(0, 3).map((movement) => (
                          <div key={movement.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{movement.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{formatDate(movement.date)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{process.movements.length}</div>
                        <p className="text-xs text-muted-foreground">Movimentações</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{process.documents.length}</div>
                        <p className="text-xs text-muted-foreground">Documentos</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{process.parties.length}</div>
                        <p className="text-xs text-muted-foreground">Partes Envolvidas</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="movements" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-4">
                    {process.movements.map((movement, index) => (
                      <div key={movement.id} className="relative flex items-start gap-4 pb-4">
                        <div className="absolute left-0 flex h-8 w-8 items-center justify-center">
                          <div className="h-3 w-3 rounded-full bg-primary border-2 border-background" />
                        </div>
                        <div className="ml-12 flex-1">
                          <Card className="hover:shadow-sm transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <p className="font-medium text-sm text-foreground pr-4">{movement.description}</p>
                                <Badge variant="outline" className="text-xs whitespace-nowrap">
                                  #{process.movements.length - index}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {formatDate(movement.date)}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="documents" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-3">
                  {process.documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">{doc.name}</p>
                              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span>{doc.document_type}</span>
                                {doc.file_size && <span>{(doc.file_size / 1024).toFixed(1)} KB</span>}
                                <span>{formatDateShort(doc.juntada_date)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}>
                                  <Download className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Baixar documento</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="parties" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-4">
                  {process.parties.map((party) => (
                    <Card key={party.id} className="overflow-hidden">
                      <CardHeader
                        className={cn(
                          "pb-3",
                          party.polo === "ATIVO" ? "bg-blue-50 dark:bg-blue-950/20" : "bg-red-50 dark:bg-red-950/20",
                        )}
                      >
                        <CardTitle className="flex items-center gap-2 text-base">
                          {party.polo === "ATIVO" ? (
                            <Gavel className="w-5 h-5 text-blue-600" />
                          ) : (
                            <ShieldAlert className="w-5 h-5 text-red-600" />
                          )}
                          <span className={party.polo === "ATIVO" ? "text-blue-700" : "text-red-700"}>
                            {party.polo}
                          </span>
                        </CardTitle>
                        <CardDescription className="font-semibold text-foreground">{party.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        {party.document_number && (
                          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Documento</p>
                            <p className="font-mono text-sm">
                              {party.document_type}: {party.document_number}
                            </p>
                          </div>
                        )}
                        {party.representatives && party.representatives.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Representantes Legais
                            </h4>
                            <div className="space-y-2">
                              {party.representatives.map((rep, idx) => (
                                <div key={idx} className="p-3 border rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium text-sm">{rep.nome}</p>
                                      <p className="text-xs text-muted-foreground">{rep.tipoRepresentacao}</p>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {rep.tipoRepresentacao}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="analysis" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                {process.analysis_content ? (
                  <div className="space-y-6">
                    <Card className="border-l-4 border-l-primary">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-primary" />
                          Análise Estratégica com IA
                        </CardTitle>
                        <CardDescription>
                          Análise automatizada baseada nos documentos e movimentações do processo
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Nível de Confiança</span>
                            <span className="text-sm font-bold">
                              {Math.round((process.analysis_content.confidence_score || 0) * 100)}%
                            </span>
                          </div>
                          <Progress value={(process.analysis_content.confidence_score || 0) * 100} className="h-2" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            Ação Recomendada
                          </h4>
                          <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                            <p className="text-sm font-medium mb-2">
                              {process.analysis_content.acao_recomendada?.proxima_acao}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <strong>Estratégia:</strong> {process.analysis_content.acao_recomendada?.estrategia}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Scale className="w-4 h-4 text-blue-600" />
                            Fundamentação Jurídica
                          </h4>
                          <div className="p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {process.analysis_content.racional_juridico}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Análise de IA Não Disponível</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Nenhuma análise de IA foi executada para este processo ainda. Execute uma análise para obter
                      insights estratégicos.
                    </p>
                    <Button onClick={onRunAIJury} disabled={isAnalyzing}>
                      {isAnalyzing ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analisando...</>
                      ) : (
                        <><Brain className="w-4 h-4 mr-2" />Executar Análise Agora</>
                      )}
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  )
}


// ============================================================================
// COMPONENTE PRINCIPAL: LegalProcessManager
// ============================================================================
export function LegalProcessManager() {
  // Estado para os campos de input
  const [searchTerm, setSearchTerm] = useState("") // Para consultar novos processos
  const [filterTerm, setFilterTerm] = useState("") // Para filtrar a lista existente

  // Estado para controlar o processo selecionado na UI
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null)

  // Hook para buscar dados da API e executar ações (mutações)
  const { processes, isLoading: isLoadingList, syncProcess, isSyncing, runAIJury, isAnalyzing } = useProcesses()

  // Hook para buscar os detalhes DO PROCESSO SELECIONADO
  // A busca só é ativada (`enabled`) quando `selectedProcessId` não é nulo.
  const { data: selectedProcessDetails, isLoading: isLoadingDetails } = useQuery<LegalProcessDetails>({
    queryKey: ["process", selectedProcessId],
    queryFn: async () => {
      const { data } = await api.get(`/processes/sync/${selectedProcessId}`)
      return data
    },
    enabled: !!selectedProcessId,
  })
  
  // Efeito para auto-selecionar o primeiro processo da lista se nenhum estiver selecionado
  useEffect(() => {
    if (!selectedProcessId && processes && processes.length > 0) {
      setSelectedProcessId(processes[0].id)
    }
  }, [processes, selectedProcessId])

  // Função para lidar com a seleção de um processo na lista
  const handleSelectProcess = (process: LegalProcess) => {
    setSelectedProcessId(process.id)
  }

  // Função para executar a análise de IA
  const handleRunAIJury = () => {
    if (selectedProcessDetails) {
      runAIJury(selectedProcessDetails.id)
    }
  }

  // Função para sincronizar um novo processo a partir do campo de busca
  const handleSyncNewProcess = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanSearchTerm = searchTerm.replace(/\D/g, "")
    if (cleanSearchTerm) {
      syncProcess(cleanSearchTerm, {
        onSuccess: (data) => {
          // Após sincronizar, seleciona o processo recém-buscado
          setSelectedProcessId(data.id)
          setSearchTerm("") // Limpa o campo de busca
        },
        onError: (error) => {
          console.error("Falha ao sincronizar processo:", error)
          // Adicionar notificação de erro para o usuário
        },
      })
    }
  }

  const renderMainContent = () => {
    // Se está buscando um novo processo OU carregando os detalhes de um selecionado
    if (isSyncing || (selectedProcessId && isLoadingDetails)) {
      return (
         <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="mt-2 text-muted-foreground">
                {isSyncing ? "Sincronizando com Jus.br..." : "Carregando detalhes..."}
              </p>
            </div>
          </div>
      )
    }
    
    // Se tem detalhes de um processo, mostra
    if (selectedProcessDetails) {
      return <ProcessDetails process={selectedProcessDetails} onRunAIJury={handleRunAIJury} isAnalyzing={isAnalyzing} />
    }

    // Tela inicial padrão
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center max-w-md">
          <Scale className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-bold text-foreground mb-3">Sistema de Gestão de Processos</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Selecione um processo da lista ao lado ou consulte um novo digitando o número no campo de busca.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><span>Documentos</span></div>
            <div className="flex items-center gap-2"><Brain className="w-4 h-4" /><span>Análise IA</span></div>
            <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>Partes</span></div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Esquerda - Lista de Processos */}
      <div className="w-96 border-r bg-card flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-6 border-b bg-card/50">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Processos Jurídicos</h2>
          </div>
          <form onSubmit={handleSyncNewProcess} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Consultar novo processo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={!searchTerm.trim() || isSyncing}>
                {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
          </form>
          <Separator className="my-4" />
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Filtrar processos..." 
              className="pl-10"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
            />
          </div>
        </div>
        <ProcessList
          processes={processes}
          isLoading={isLoadingList}
          onSelectProcess={handleSelectProcess}
          selectedProcessId={selectedProcessId}
          filterTerm={filterTerm}
        />
      </div>
      <div className="flex-1 flex flex-col">{renderMainContent()}</div>
    </div>
  )
}