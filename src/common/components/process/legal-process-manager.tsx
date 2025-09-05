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
  MapPin,
  Hash,
  Shield,
  FileCheck,
  Building2,
  Link as LinkIcon,
  ListChecks,
  Landmark,
  BookMarked,
} from "lucide-react"

import DOMPurify from "dompurify" 

import type { AIAction, AIAnalysisContent, LegalProcess, LegalProcessDetails, ProcessDocument } from "../../interfaces/types"
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion"

//////////////////////////////////////////////
// ============ Small helpers ============= //
//////////////////////////////////////////////

const SafeHtml = ({ html }: { html: string }) => {
  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  )
}

const List = ({ items }: { items?: string[] }) =>
  items && items.length > 0 ? (
    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-muted-foreground">—</p>
  )

const KV = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-2 py-1">
    <div className="col-span-1 text-xs font-medium text-muted-foreground">{label}</div>
    <div className="col-span-2 text-sm">{value ?? "—"}</div>
  </div>
)

//////////////////////////////////////////////
// =========== Process List =============== //
//////////////////////////////////////////////

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
        (p.classe_processual ?? "").toLowerCase().includes(term) ||
        (p.assunto ?? "").toLowerCase().includes(term),
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

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{process.tribunal}</span>
                  </div>
                  {process.instance && (
                    <div className="flex items-center gap-1">
                      <Scale className="w-3 h-3" />
                      <span>{process.instance}</span>
                    </div>
                  )}
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

//////////////////////////////////////////////
// ========== Process Details ============= //
//////////////////////////////////////////////

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
    }
  }

  const handleView = (doc: ProcessDocument) => {
    const url = `/processes/${process.id}/documents/${doc.id}/view`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const parties = process.parties ?? []
  const documents = process.documents ?? []
  const movements = process.movements ?? []

  const getPartyByType = (polo: "ATIVO" | "PASSIVO") => parties.find((p) => p.polo === polo)

  const getStatusIcon = (status: string | null | undefined) => {
    switch ((status ?? "").toLowerCase()) {
      case "em andamento":
      case "active":
        return <Clock className="w-4 h-4 text-blue-500" />
      case "finalizado":
      case "inactive":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case "suspenso":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getSecrecyLevelBadge = (level?: number | null) => {
    switch (level) {
      case 0:
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            Público
          </Badge>
        )
      case 1:
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Restrito
          </Badge>
        )
      case 2:
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Sigiloso
          </Badge>
        )
      default:
        return <Badge variant="outline">Não definido</Badge>
    }
  }

  // ====== ANALYSIS (robusto) ======
  const analysis = (process.analysis_content ?? {}) as AIAnalysisContent
  const arb = analysis?.arbiter ?? {}
  const confidence = Number(
    (analysis?.confidence_score ?? arb?.confidence_score ?? 0) as number,
  )
  const action = (analysis?.acao_recomendada ?? arb?.acao_recomendada) as AIAction | undefined
  const racional = (analysis?.racional_juridico ?? arb?.racional_juridico ?? "") as string

  const legal = analysis?.legal_context
  const extr = analysis?.extractions
  const opinions = analysis?.opinions
  const summary = analysis?.summary
  const timeline = analysis?.inputs?.timeline ?? []
  const evidence = analysis?.inputs?.evidence_index ?? { docs: {}, moves: [] }
  const evidenceDocs = evidence?.docs ?? {}

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b bg-card/50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Gavel className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold text-foreground">{process.classe_processual}</h1>
                {getSecrecyLevelBadge(process.secrecy_level ?? null)}
              </div>
              <p className="font-mono text-sm text-muted-foreground mb-1">{process.process_number}</p>
              <p className="text-sm text-muted-foreground mb-2">{process.assunto}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-2">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>{process.tribunal_nome}</span>
                </div>
                {process.tribunal_segmento && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{process.tribunal_segmento}</span>
                  </div>
                )}
              </div>

              {process.assunto_hierarquia && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Hierarquia:</span> {process.assunto_hierarquia}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(process.status)}
                <Badge variant="outline" className="font-medium">
                  {process.status || "Status indefinido"}
                </Badge>
              </div>
              {process.permite_peticionar && (
                <Badge variant="secondary" className="text-xs">
                  <FileCheck className="w-3 h-3 mr-1" />
                  Permite Peticionar
                </Badge>
              )}
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-blue-500" />
                  <p className="text-xs font-medium text-muted-foreground">AUTOR</p>
                </div>
                <p className="font-semibold text-sm text-foreground truncate">
                  {getPartyByType("ATIVO")?.name || "N/A"}
                </p>
                {getPartyByType("ATIVO")?.ajg && (
                  <Badge variant="outline" className="text-xs mt-1">
                    AJG
                  </Badge>
                )}
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                  <p className="text-xs font-medium text-muted-foreground">RÉU</p>
                </div>
                <p className="font-semibold text-sm text-foreground truncate">
                  {getPartyByType("PASSIVO")?.name || "N/A"}
                </p>
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
                  <p className="text-xs font-medium text-muted-foreground">INSTÂNCIA</p>
                </div>
                <p className="font-semibold text-sm text-foreground truncate">{process.degree_nome || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{process.instance}</p>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button onClick={onRunAIJury} disabled={isAnalyzing} className="flex items-center gap-2">
              {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              {isAnalyzing ? "Analisando..." : "Análise com IA"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="movements">Movimentações</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
                <TabsTrigger value="parties">Partes</TabsTrigger>
                <TabsTrigger value="analysis">Análise IA</TabsTrigger>
              </TabsList>
            </div>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-6">
                  {/* Resumo (HTML) */}
                  {process.summary_content && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Resumo do Processo
                        </CardTitle>
                        <CardDescription>Gerado automaticamente pela análise IA</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <SafeHtml html={process.summary_content} />
                      </CardContent>
                    </Card>
                  )}

                  {/* Atividade recente */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Atividade Recente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {movements.slice(0, 3).map((movement) => (
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

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{movements.length}</div>
                        <p className="text-xs text-muted-foreground">Movimentações</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{documents.length}</div>
                        <p className="text-xs text-muted-foreground">Documentos</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{parties.length}</div>
                        <p className="text-xs text-muted-foreground">Partes Envolvidas</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* DETAILS */}
            <TabsContent value="details" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-6">
                  {/* Classificação */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hash className="w-5 h-5" />
                        Classificação Processual
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Classe Processual</p>
                          <p className="text-sm font-semibold">{process.classe_processual}</p>
                          {process.classe_codigo && (
                            <p className="text-xs text-muted-foreground">Código: {process.classe_codigo}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Assunto</p>
                          <p className="text-sm font-semibold">{process.assunto}</p>
                          {process.assunto_codigo && (
                            <p className="text-xs text-muted-foreground">Código: {process.assunto_codigo}</p>
                          )}
                        </div>
                      </div>
                      {process.assunto_hierarquia && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Hierarquia do Assunto</p>
                          <p className="text-sm text-muted-foreground">{process.assunto_hierarquia}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tribunal */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Informações do Tribunal
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Tribunal</p>
                          <p className="text-sm font-semibold">{process.tribunal_nome}</p>
                          <p className="text-xs text-muted-foreground">Sigla: {process.tribunal}</p>
                          {process.tribunal_jtr && (
                            <p className="text-xs text-muted-foreground">JTR: {process.tribunal_jtr}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Segmento</p>
                          <p className="text-sm font-semibold">{process.tribunal_segmento}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Grau de Jurisdição</p>
                          <p className="text-sm font-semibold">{process.degree_nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {process.degree_sigla} {process.degree_numero ? `- Número: ${process.degree_numero}` : ""}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Órgão Julgador</p>
                          <p className="text-sm font-semibold">{process.orgao_julgador}</p>
                          {process.orgao_julgador_id && (
                            <p className="text-xs text-muted-foreground">ID: {process.orgao_julgador_id}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Datas e status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Datas e Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {process.start_date && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Data de Início</p>
                            <p className="text-sm font-semibold">{formatDate(process.start_date)}</p>
                          </div>
                        )}
                        {process.last_update && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Última Atualização</p>
                            <p className="text-sm font-semibold">{formatDate(process.last_update)}</p>
                          </div>
                        )}
                      </div>
                      {process.distribuicao_first_datetime && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Data de Distribuição</p>
                          <p className="text-sm font-semibold">{formatDate(process.distribuicao_first_datetime)}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Flags */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Configurações e Permissões
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {process.permite_peticionar && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <FileCheck className="w-3 h-3" />
                            Permite Peticionar
                          </Badge>
                        )}
                        {process.ativo && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Processo Ativo
                          </Badge>
                        )}
                        {getSecrecyLevelBadge(process.secrecy_level)}
                        {process.fonte_dados_codex_id && (
                          <Badge variant="outline">Codex ID: {process.fonte_dados_codex_id}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* MOVEMENTS */}
            <TabsContent value="movements" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-4">
                    {movements.map((movement, index) => (
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
                                  #{movements.length - index}
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

            {/* DOCUMENTS */}
            <TabsContent value="documents" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-foreground truncate">{doc.name}</p>
                              <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span>{doc.document_type}</span>
                                {typeof doc.file_size === "number" && <span>{(doc.file_size / 1024).toFixed(1)} KB</span>}
                                {doc.juntada_date && <span>{formatDateShort(doc.juntada_date)}</span>}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                                {typeof doc.pages === "number" && (
                                  <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" />
                                    {doc.pages} páginas
                                  </span>
                                )}
                                {typeof doc.sequence === "number" && (
                                  <span className="flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    Seq. {doc.sequence}
                                  </span>
                                )}
                                {doc.secrecy_level && (
                                  <Badge variant="outline" className="text-xs">
                                    {doc.secrecy_level}
                                  </Badge>
                                )}
                              </div>
                              {doc.type_name && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  <span className="font-medium">Tipo:</span> {doc.type_name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => handleView(doc)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Visualizar</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                                  <Download className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Baixar</p>
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

            {/* PARTIES */}
            <TabsContent value="parties" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                <div className="space-y-4">
                  {parties.map((party) => (
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
                          <div className="flex gap-1 ml-auto">
                            {party.ajg && (
                              <Badge variant="outline" className="text-xs">
                                AJG
                              </Badge>
                            )}
                            {party.sigilosa && (
                              <Badge variant="outline" className="text-xs text-red-600 border-red-600">
                                <Shield className="w-3 h-3 mr-1" />
                                Sigilosa
                              </Badge>
                            )}
                          </div>
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
                              {party.representatives.map((rep: any, idx: number) => (
                                <div key={idx} className="p-3 border rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="font-medium text-sm">{rep.nome}</p>
                                      <p className="text-xs text-muted-foreground">{rep.tipoRepresentacao}</p>
                                      {rep.oab && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          <span className="font-medium">OAB:</span> {rep.oab}
                                        </p>
                                      )}
                                      {rep.cadastroReceitaFederal && rep.cadastroReceitaFederal.length > 0 && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                          <span className="font-medium">{rep.cadastroReceitaFederal[0].tipo}:</span>{" "}
                                          {rep.cadastroReceitaFederal[0].numero}
                                        </p>
                                      )}
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

            {/* ANALYSIS */}
            <TabsContent value="analysis" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full px-6 pb-6">
                {process.analysis_content ? (
                  <div className="space-y-6">
                    {/* Header da Análise */}
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
                        {/* Confiança */}
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Nível de Confiança</span>
                            <span className="text-sm font-bold">
                              {Math.round(Math.max(0, Math.min(100, confidence * 100)))}%
                            </span>
                          </div>
                          <Progress value={Math.max(0, Math.min(100, confidence * 100))} className="h-2" />
                        </div>

                        {/* Próxima ação */}
                        {(action?.proxima_acao || action?.estrategia) && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <ListChecks className="w-4 h-4 text-green-600" />
                              Ação Recomendada
                            </h4>
                            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                              {action?.proxima_acao && (
                                <p className="text-sm font-medium mb-2">{action.proxima_acao}</p>
                              )}
                              {action?.estrategia && (
                                <p className="text-sm text-muted-foreground">
                                  <strong>Estratégia: </strong>
                                  {action.estrategia}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Racional jurídico */}
                        {racional && (
                          <div>
                            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                              <Scale className="w-4 h-4 text-blue-600" />
                              Fundamentação Jurídica
                            </h4>
                            <div className="p-4 border rounded-lg">
                              <p className="text-sm text-muted-foreground leading-relaxed">{racional}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Resumo Sintetizado (JSON) */}
                    {summary && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookMarked className="w-4 h-4" />
                            Resumo Sintetizado
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <KV label="Resumo Executivo" value={<p className="text-sm text-muted-foreground">{summary.sumario_executivo || "—"}</p>} />
                          {summary.status_e_proximos_passos && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-muted-foreground mb-1">Status e Próximos Passos</p>
                              <div className="rounded-lg border p-3">
                                <KV label="Status Atual" value={<span className="text-sm">{summary.status_e_proximos_passos.status_atual || "—"}</span>} />
                                <KV label="Tarefas" value={<List items={summary.status_e_proximos_passos.tarefas} />} />
                                <KV label="Riscos" value={<List items={summary.status_e_proximos_passos.riscos} />} />
                                <KV label="Oportunidades" value={<List items={summary.status_e_proximos_passos.oportunidades} />} />
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Contexto Legal & Extrações */}
                    {(legal || extr) && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {legal && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Landmark className="w-4 h-4" />
                                Contexto Legal
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <KV label="Tese da Autora" value={<span className="text-sm">{legal.tese_autora || "—"}</span>} />
                              <KV label="Tese do Réu" value={<span className="text-sm">{legal.tese_reu || "—"}</span>} />
                              <KV label="Pontos Controversos" value={<List items={legal.pontos_controversos} />} />
                              <KV label="Provas Relevantes" value={<List items={legal.provas_relevantes} />} />
                              <KV label="Riscos" value={<List items={legal.riscos} />} />
                              <KV label="Oportunidades" value={<List items={legal.oportunidades} />} />
                              <KV label="Marcos Procedimentais" value={<List items={legal.marcos_procedimentais} />} />
                            </CardContent>
                          </Card>
                        )}

                        {extr && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Scale className="w-4 h-4" />
                                Extrações
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <KV label="Pedidos da Autora" value={<List items={extr.pedidos_autora} />} />
                              <KV label="Defesas do Réu" value={<List items={extr.defesas_reu} />} />
                              <KV label="Valores Reclamados" value={<List items={extr.valores_reclamados} />} />
                              <KV label="Valores Comprovados" value={<List items={extr.valores_comprovados} />} />
                              <KV label="Precedentes Citados" value={<List items={extr.precedentes_citados} />} />
                              <KV label="Prazos Pendentes" value={<List items={extr.prazos_pendentes} />} />
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {/* Opiniões */}
                    {opinions && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {opinions.conservadora && (
                          <Card className="border-l-4 border-l-amber-500">
                            <CardHeader>
                              <CardTitle>Opinião — Conservadora</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <KV label="Tese" value={<p className="text-sm text-muted-foreground">{opinions.conservadora.tese || "—"}</p>} />
                              <KV label="Pontos Fortes" value={<List items={opinions.conservadora.pontos_fortes} />} />
                              <KV label="Pontos Fracos" value={<List items={opinions.conservadora.pontos_fracos} />} />
                              <KV label="Faixa de Acordo" value={<span className="text-sm">{opinions.conservadora.faixa_acordo_recomendada || "—"}</span>} />
                              <KV label="Recomendações" value={<List items={opinions.conservadora.recomendacoes} />} />
                            </CardContent>
                          </Card>
                        )}
                        {opinions.estrategica && (
                          <Card className="border-l-4 border-l-indigo-500">
                            <CardHeader>
                              <CardTitle>Opinião — Estratégica</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <KV label="Tese" value={<p className="text-sm text-muted-foreground">{opinions.estrategica.tese || "—"}</p>} />
                              <KV label="Pontos Fortes" value={<List items={opinions.estrategica.pontos_fortes} />} />
                              <KV label="Pontos Fracos" value={<List items={opinions.estrategica.pontos_fracos} />} />
                              <KV label="Faixa de Acordo" value={<span className="text-sm">{opinions.estrategica.faixa_acordo_recomendada || "—"}</span>} />
                              <KV label="Recomendações" value={<List items={opinions.estrategica.recomendacoes} />} />
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}

                    {/* Árbitro (decisão) */}
                    {(arb && (arb.referencias?.length || arb.confidence_score !== undefined)) && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Gavel className="w-4 h-4" />
                            Júri / Árbitro
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <KV label="Confiança do Árbitro" value={<span className="text-sm">{arb.confidence_score !== undefined ? `${Math.round((arb.confidence_score ?? 0) * 100)}%` : "—"}</span>} />
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Referências</p>
                            {arb.referencias && arb.referencias.length > 0 ? (
                              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                                {arb.referencias.map((r: string, i: number) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-muted-foreground">—</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Timeline + Evidences */}
                    {(timeline?.length || evidence?.moves?.length) && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Timeline & Evidências
                          </CardTitle>
                          <CardDescription>
                            Eventos consolidados e referência cruzada a documentos
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="tl">
                              <AccordionTrigger>Timeline do Processo</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3">
                                  {timeline.map((it, idx) => {
                                    const doc = it.doc_ref ? evidenceDocs[it.doc_ref] : undefined
                                    return (
                                      <div key={idx} className="p-3 rounded-lg border">
                                        <div className="flex items-center justify-between">
                                          <span className="text-xs text-muted-foreground">{formatDate(it.data ?? "")}</span>
                                          <Badge variant="outline" className="text-2xs">{it.tipo || "MOVIMENTO"}</Badge>
                                        </div>
                                        <p className="text-sm mt-1">{it.descricao}</p>
                                        {doc && (
                                          <div className="flex items-center gap-2 mt-2 text-xs">
                                            <LinkIcon className="w-3 h-3" />
                                            {doc.url ? (
                                              <a href={doc.url} target="_blank" rel="noreferrer" className="underline">
                                                {doc.label || it.doc_ref}
                                              </a>
                                            ) : (
                                              <span className="text-muted-foreground">{doc.label || it.doc_ref}</span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                  {timeline.length === 0 && <p className="text-sm text-muted-foreground">—</p>}
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="idx">
                              <AccordionTrigger>Índice de Evidências</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {Object.entries(evidenceDocs).length > 0 ? (
                                    Object.entries(evidenceDocs).map(([docId, meta]) => (
                                      <div key={docId} className="p-3 rounded-lg border">
                                        <p className="text-sm font-medium">{meta.label || docId}</p>
                                        <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                                          {meta.data && <span>Data: {formatDate(meta.data)}</span>}
                                          {meta.tipo && <span>Tipo: {meta.tipo}</span>}
                                        </div>
                                        {meta.url && (
                                          <div className="mt-2">
                                            <a
                                              className="text-xs underline inline-flex items-center gap-1"
                                              href={meta.url}
                                              target="_blank"
                                              rel="noreferrer"
                                            >
                                              <LinkIcon className="w-3 h-3" /> Abrir
                                            </a>
                                          </div>
                                        )}
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground">—</p>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            {analysis?.raw_agent_outputs && (
                              <AccordionItem value="raw">
                                <AccordionTrigger>Depuração (Saídas dos Agentes)</AccordionTrigger>
                                <AccordionContent>
                                  <pre className="text-xs overflow-auto p-3 rounded bg-muted/50">
                                    {JSON.stringify(analysis.raw_agent_outputs, null, 2)}
                                  </pre>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                          </Accordion>
                        </CardContent>
                      </Card>
                    )}

                    {/* Rodapé com metadados */}
                    {(analysis.generated_at || analysis.process_number) && (
                      <div className="text-xs text-muted-foreground">
                        {analysis.generated_at && <span>Gerado em {formatDate(analysis.generated_at)}</span>}
                        {analysis.process_number && <span className="ml-2">• Processo: {analysis.process_number}</span>}
                      </div>
                    )}
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
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analisando...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Executar Análise Agora
                        </>
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

//////////////////////////////////////////////
// ========== Root: Process Manager ========= //
//////////////////////////////////////////////

export function LegalProcessManager() {
  // Inputs
  const [searchTerm, setSearchTerm] = useState("") // Consultar novo processo
  const [filterTerm, setFilterTerm] = useState("") // Filtrar lista

  // Seleção
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null)

  // Hook de processos (lista / sync / análise)
  const { processes, isLoading: isLoadingList, syncProcess, isSyncing, runAIJury, isAnalyzing } = useProcesses()

  // Detalhes do processo selecionado
  const { data: selectedProcessDetails, isLoading: isLoadingDetails } = useQuery<LegalProcessDetails>({
    queryKey: ["process", selectedProcessId],
    queryFn: async () => {
      const { data } = await api.get(`/processes/${selectedProcessId}`)
      return data
    },
    enabled: !!selectedProcessId,
  })

  // Auto-seleciona o primeiro se não houver selecionado
  useEffect(() => {
    if (!selectedProcessId && processes && processes.length > 0) {
      setSelectedProcessId(processes[0].id)
    }
  }, [processes, selectedProcessId])

  const handleSelectProcess = (process: LegalProcess) => {
    setSelectedProcessId(process.id)
  }

  const handleRunAIJury = () => {
    if (selectedProcessDetails) {
      runAIJury(selectedProcessDetails.id)
    }
  }

  const handleSyncNewProcess = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = searchTerm.replace(/\D/g, "")
    if (clean) {
      syncProcess(clean, {
        onSuccess: (data: LegalProcess) => {
          setSelectedProcessId(data.id)
          setSearchTerm("")
        },
        onError: (error: unknown) => {
          console.error("Falha ao sincronizar processo:", error)
        },
      })
    }
  }

  const renderMainContent = () => {
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

    if (selectedProcessDetails) {
      return (
        <ProcessDetails process={selectedProcessDetails} onRunAIJury={handleRunAIJury} isAnalyzing={isAnalyzing} />
      )
    }

    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center max-w-md">
          <Scale className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-bold text-foreground mb-3">Sistema de Gestão de Processos</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Selecione um processo da lista ao lado para visualizar detalhes, movimentações, documentos e análises de IA,
            ou consulte um novo processo digitando o número no campo de busca.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Documentos</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span>Análise IA</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Partes</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar esquerda */}
      <div className="w-96 border-r bg-card flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-card/50">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Processos Jurídicos</h2>
          </div>

          {/* Consulta novo processo */}
          <form onSubmit={handleSyncNewProcess} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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

          {/* Filtro */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar processos..."
              className="pl-10"
              value={filterTerm}
              onChange={(e) => setFilterTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista */}
        <ProcessList
          processes={processes}
          isLoading={isLoadingList}
          onSelectProcess={handleSelectProcess}
          selectedProcessId={selectedProcessId}
          filterTerm={filterTerm}
        />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">{renderMainContent()}</div>
    </div>
  )
}