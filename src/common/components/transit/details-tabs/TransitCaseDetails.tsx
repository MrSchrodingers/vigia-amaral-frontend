"use client"

import {
  CheckCircle2,
  XCircle,
  Calendar,
  FileText,
  Scale,
  Building2,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { ScrollArea } from "../../ui/scroll-area"
import type { TransitAnalysis } from "../types"

interface TransitCaseDetailsProps {
  case: TransitAnalysis
}

const formatCurrency = (value?: number) => {
  if (!value && value !== 0) return "N/A"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "—"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))
}

const formatDateShort = (dateString?: string | null) => {
  if (!dateString) return "—"
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString))
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Confirmado":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />
    case "Não Transitado":
      return <XCircle className="w-5 h-5 text-red-500" />
    default:
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Confirmado":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Confirmado
        </Badge>
      )
    case "Não Transitado":
      return (
        <Badge variant="destructive">
          <XCircle className="w-3 h-3 mr-1" />
          Não Transitado
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary">
          <AlertCircle className="w-3 h-3 mr-1" />
          {status}
        </Badge>
      )
  }
}

export function TransitCaseDetails({ case: case_ }: TransitCaseDetailsProps) {
  const confidence = case_.analysis_raw_data?.confidence || 0

  return (
    <ScrollArea className="h-full">
      <div className="p-4 lg:p-6 space-y-6 max-w-6xl mx-auto">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(case_.status)}
                <h1 className="text-xl font-bold text-foreground">Análise de Trânsito em Julgado</h1>
              </div>
              <p className="font-mono text-sm text-primary bg-primary/5 px-3 py-1 rounded-md inline-block">
                {case_.process?.process_number}
              </p>
            </div>
            {getStatusBadge(case_.status)}
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">{case_.process?.classe_processual}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{case_.process?.assunto}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                <p className="text-xs font-medium text-muted-foreground">TRIBUNAL</p>
              </div>
              <p className="font-semibold text-sm text-foreground">{case_.process?.tribunal_nome || "N/A"}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-4 h-4 text-purple-500" />
                <p className="text-xs font-medium text-muted-foreground">INSTÂNCIA</p>
              </div>
              <p className="font-semibold text-sm text-foreground">{case_.process?.degree_nome || "N/A"}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <p className="text-xs font-medium text-muted-foreground">VALOR DA CAUSA</p>
              </div>
              <p className="font-bold text-sm text-primary">{formatCurrency(case_.process?.valor_causa)}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <p className="text-xs font-medium text-muted-foreground">DATA DO TRÂNSITO</p>
              </div>
              <p className="font-semibold text-sm text-foreground">{formatDateShort(case_.transit_date)}</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Detalhes da Análise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {case_.justification && (
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-600" />
                  Justificativa
                </h4>
                <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{case_.justification}</p>
                </div>
              </div>
            )}
            {case_.key_movements && case_.key_movements.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  Movimentações Relevantes
                </h4>
                <div className="space-y-3">
                  {case_.key_movements.map((movement_description, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{movement_description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Histórico da Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Criado em:</p>
                <p className="font-medium">{formatDate(case_.created_at)}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Última atualização:</p>
                <p className="font-medium">{formatDate(case_.updated_at)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {case_.analysis_raw_data && Object.keys(case_.analysis_raw_data).length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Dados Brutos da Análise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto p-3 rounded bg-muted/50 max-h-48">
                {JSON.stringify(case_.analysis_raw_data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </ScrollArea>
  )
}