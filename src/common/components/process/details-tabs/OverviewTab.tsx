import type React from "react"
import { Activity, FileText, Users, Clock } from "lucide-react"
import type { LegalProcessDetails } from "../types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { SafeHtml } from "../shared/SafeHtml"
import { formatDate } from "../../shared/utils/shared_utils"
import { Badge } from "../../ui/badge"

interface OverviewTabProps {
  process: LegalProcessDetails
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ process }) => {
  const movements = process.movements ?? []
  const documents = process.documents ?? []
  const parties = process.parties ?? []

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <div className="text-2xl font-bold text-primary">{movements.length}</div>
            </div>
            <p className="text-sm text-muted-foreground">Movimentações</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-green-500" />
              <div className="text-2xl font-bold text-primary">{documents.length}</div>
            </div>
            <p className="text-sm text-muted-foreground">Documentos</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-sm transition-shadow">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="w-5 h-5 text-purple-500" />
              <div className="text-2xl font-bold text-primary">{parties.length}</div>
            </div>
            <p className="text-sm text-muted-foreground">Partes Envolvidas</p>
          </CardContent>
        </Card>
      </div>
      {process.summary_content && (
        <Card className="hover:shadow-sm transition-shadow">
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
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movements.slice(0, 5).map((movement, index) => (
              <div
                key={movement.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{movement.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{formatDate(movement.date)}</p>
                    <Badge variant="outline" className="text-xs">
                      #{movements.length - index}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            {movements.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma movimentação registrada</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}