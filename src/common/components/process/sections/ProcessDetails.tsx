import type React from "react"
import {
  Brain,
  Gavel,
  ShieldAlert,
  Calendar,
  Building,
  Users,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MapPin,
  Scale,
  Shield,
  FileCheck,
  Building2,
  Activity,
  Hash,
  FileText,
  TrendingUp,
  ShieldCheck,
} from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { ScrollArea } from "../../ui/scroll-area"
import { formatCurrency, formatDate } from "../../shared/utils/shared_utils"
import type { LegalProcessDetails, PartyPolo } from "../types"
import { OverviewTab } from "../details-tabs/OverviewTab"
import { DetailsTab } from "../details-tabs/DetailsTab"
import { MovementsTab } from "../details-tabs/MovementsTab"
import { DocumentsTab } from "../details-tabs/DocumentsTab"
import { PartiesTab } from "../details-tabs/PartiesTab"
import { AnalysisTab } from "../details-tabs/AnalysisTab"
import { Loader2 } from "lucide-react"

interface ProcessDetailsProps {
  process: LegalProcessDetails
  onRunAIJury: () => void
  isAnalyzing: boolean
  onRunTransitAnalysis: () => void
  isAnalyzingTransit: boolean
}

export const ProcessDetails: React.FC<ProcessDetailsProps> = ({
  process,
  onRunAIJury,
  isAnalyzing,
  onRunTransitAnalysis,
  isAnalyzingTransit,
}) => {
  const getPartyByType = (polo: PartyPolo) => (process.parties as any[])?.find((p: any) => p.polo === polo)

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
            <Shield className="w-3 h-3 mr-1" /> Público
          </Badge>
        )
      case 1:
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Shield className="w-3 h-3 mr-1" /> Restrito
          </Badge>
        )
      case 2:
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <Shield className="w-3 h-3 mr-1" /> Sigiloso
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Shield className="w-3 h-3 mr-1" /> Não definido
          </Badge>
        )
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-6 border-b bg-gradient-to-r from-card/80 to-card/40 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Gavel className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-lg lg:text-xl font-bold text-foreground truncate">{process.classe_processual}</h1>
              </div>
              <div className="flex items-center gap-2">
                {getSecrecyLevelBadge(process.secrecy_level ?? null)}
                {process.permite_peticionar && (
                  <Badge variant="secondary" className="text-xs">
                    <FileCheck className="w-3 h-3 mr-1" /> Permite Peticionar
                  </Badge>
                )}
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <p className="font-mono text-sm text-primary bg-primary/5 px-3 py-1 rounded-md inline-block">
                {process.process_number}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">{process.assunto}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{process?.tribunal_nome ?? process?.tribunal}</span>
              </div>
              {process.tribunal_segmento && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  <span>{process.tribunal_segmento}</span>
                </div>
              )}
              {process.degree_nome && (
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-purple-500" />
                  <span>{process.degree_nome}</span>
                </div>
              )}
              {process.start_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>{formatDate(process.start_date)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(process.status)}
              <Badge variant="outline" className="font-medium">
                {process.status || "Status indefinido"}
              </Badge>
            </div>
            <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
              <Button
                onClick={onRunTransitAnalysis}
                disabled={isAnalyzingTransit || isAnalyzing}
                className="w-full lg:w-auto"
                size="sm"
                variant="outline"
              >
                {isAnalyzingTransit ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verificando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 mr-2" /> Analisar Trânsito
                  </>
                )}
              </Button>

              {/* Botão Original de Análise com IA */}
              <Button
                onClick={onRunAIJury}
                disabled={isAnalyzing || isAnalyzingTransit}
                className="w-full lg:w-auto"
                size="sm"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analisando...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" /> Análise com IA
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Card className="border-l-4 border-l-blue-500 hover:shadow-sm transition-shadow">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-500" />
                <p className="text-xs font-medium text-muted-foreground">AUTOR</p>
              </div>
              <p className="font-semibold text-sm text-foreground truncate" title={getPartyByType("ATIVO")?.name || "N/A"}>
                {getPartyByType("ATIVO")?.name || "N/A"}
              </p>
              {getPartyByType("ATIVO")?.ajg && (
                <Badge variant="outline" className="text-xs mt-1">
                  AJG
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500 hover:shadow-sm transition-shadow">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                <p className="text-xs font-medium text-muted-foreground">RÉU</p>
              </div>
              <p
                className="font-semibold text-sm text-foreground truncate"
                title={getPartyByType("PASSIVO")?.name || "N/A"}
              >
                {getPartyByType("PASSIVO")?.name || "N/A"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500 hover:shadow-sm transition-shadow">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <p className="text-xs font-medium text-muted-foreground">VALOR DA CAUSA</p>
              </div>
              <p className="font-bold text-sm text-primary">{formatCurrency(process.valor_causa ?? 0)}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500 hover:shadow-sm transition-shadow">
            <CardContent className="p-3 lg:p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-purple-500" />
                <p className="text-xs font-medium text-muted-foreground">INSTÂNCIA</p>
              </div>
              <p className="font-semibold text-sm text-foreground truncate">{process.degree_nome || "N/A"}</p>
              <p className="text-xs text-muted-foreground">{(process as any).instance}</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="overview" className="h-full flex flex-col">
          <div className="px-4 lg:px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto">
              <TabsTrigger value="overview" className="text-xs lg:text-sm">
                <Activity className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Visão Geral</span>
                <span className="sm:hidden">Geral</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="text-xs lg:text-sm">
                <Hash className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Detalhes</span>
                <span className="sm:hidden">Info</span>
              </TabsTrigger>
              <TabsTrigger value="movements" className="text-xs lg:text-sm">
                <Clock className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Movimentações</span>
                <span className="sm:hidden">Moves</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="text-xs lg:text-sm">
                <FileText className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Documentos</span>
                <span className="sm:hidden">Docs</span>
              </TabsTrigger>
              <TabsTrigger value="parties" className="text-xs lg:text-sm">
                <Users className="w-4 h-4 mr-1 lg:mr-2" /> Partes
              </TabsTrigger>
              <TabsTrigger value="analysis" className="text-xs lg:text-sm">
                <Brain className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">Análise IA</span>
                <span className="sm:hidden">IA</span>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="overview" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4 lg:px-6 pb-6">
              <OverviewTab process={process} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="details" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4 lg:px-6 pb-6">
              <DetailsTab process={process} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="movements" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4 lg:px-6 pb-6">
              <MovementsTab process={process} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="documents" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4 lg:px-6 pb-6">
              <DocumentsTab process={process} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="parties" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4 lg:px-6 pb-6">
              <PartiesTab process={process} />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="analysis" className="flex-1 overflow-hidden mt-4">
            <ScrollArea className="h-full px-4 lg:px-6 pb-6">
              <AnalysisTab process={process} onRunAIJury={onRunAIJury} isAnalyzing={isAnalyzing} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}