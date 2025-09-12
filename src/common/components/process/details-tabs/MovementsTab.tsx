import type React from "react"
import { Clock, Calendar } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { formatDate } from "../../shared/utils/shared_utils"
import type { LegalProcessDetails } from "../types"

interface MovementsTabProps {
  process: LegalProcessDetails
}

export const MovementsTab: React.FC<MovementsTabProps> = ({ process }) => {
  const movements = process.movements ?? []

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
      <div className="space-y-4">
        {movements.map((movement, index) => (
          <div key={movement.id} className="relative flex items-start gap-4 pb-4">
            <div className="absolute left-0 flex h-8 w-8 items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-primary border-2 border-background shadow-sm" />
            </div>
            <div className="ml-12 flex-1">
              <Card className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <p className="font-medium text-sm text-foreground pr-4 leading-relaxed">{movement.description}</p>
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
        {movements.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhuma movimentação registrada</p>
          </div>
        )}
      </div>
    </div>
  )
}