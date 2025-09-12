"use client"
import { Clock, CheckCircle2, XCircle, Calendar, Building2, Scale } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { ScrollArea } from "../../ui/scroll-area"
import { Skeleton } from "../../ui/skeleton"
import type { TransitAnalysis } from "../types"
import { cn } from "@/src/common/utils/utils"

interface TransitCasesListProps {
  cases: TransitAnalysis[]
  selectedCaseId: string | null
  onSelectCase: (caseId: string) => void
  isLoading: boolean
}

const formatCurrency = (value?: number) => {
  if (!value) return "R$ 0,00"
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
  }).format(new Date(dateString))
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Confirmado":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />
    case "Não Transitado":
      return <XCircle className="w-4 h-4 text-red-500" />
    default:
      return <Clock className="w-4 h-4 text-yellow-500" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Confirmado":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Confirmado</Badge>
    case "Não Transitado":
      return <Badge variant="destructive">Não Transitado</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function TransitCasesList({ cases, selectedCaseId, onSelectCase, isLoading }: TransitCasesListProps) {
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

  if (cases.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <Scale className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Nenhum caso encontrado</h3>
        <p className="text-sm text-muted-foreground">Tente ajustar os filtros ou termos de busca.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-3">
        {cases.map((case_) => (
          <Card
            key={case_.id}
            className={cn(
              "cursor-pointer transition-all duration-300 hover:shadow-md",
              selectedCaseId === case_.id && "ring-2 ring-primary/20 bg-primary/5",
            )}
            onClick={() => onSelectCase(case_.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(case_.status)}
                  <p className="font-mono text-sm text-primary">{case_.process?.process_number}</p>
                </div>
                {getStatusBadge(case_.status)}
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-sm text-foreground line-clamp-1">{case_.process?.classe_processual}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{case_.process?.assunto}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span className="truncate">{case_.process?.tribunal_nome}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Scale className="w-3 h-3" />
                  <span className="truncate">{case_.process?.degree_nome}</span>
                </div>
                {case_.transit_date && (
                  <div className="flex items-center gap-1 col-span-2">
                    <Calendar className="w-3 h-3" />
                    <span>Trânsito: {formatDate(case_.transit_date)}</span>
                  </div>
                )}
              </div>

              {case_.process?.valor_causa && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-green-600">{formatCurrency(case_.process.valor_causa)}</p>
                </div>
              )}

              {selectedCaseId === case_.id && (
                <div className="mt-2 flex justify-end">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}
