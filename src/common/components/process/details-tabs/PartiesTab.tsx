import type React from "react"
import { Gavel, ShieldAlert, Users, Shield } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { cn } from "../../../utils/utils"
import type { LegalProcessDetails, Representative } from "../types"
import { KV } from "../shared/KV"

interface PartiesTabProps {
  process: LegalProcessDetails
}

export const PartiesTab: React.FC<PartiesTabProps> = ({ process }) => {
  const parties = (process.parties as any[]) ?? []

  return (
    <div className="space-y-4">
      {parties.map((party) => {
        const reps = (party.representatives ?? []) as Representative[]
        return (
          <Card key={party.id ?? party.name} className="overflow-hidden hover:shadow-sm transition-shadow">
            <CardHeader
              className={cn(
                "pb-3",
                party.polo === "ATIVO"
                  ? "bg-blue-50 dark:bg-blue-950/20 border-l-4 border-l-blue-500"
                  : "bg-red-50 dark:bg-red-950/20 border-l-4 border-l-red-500"
              )}
            >
              <CardTitle className="flex items-center gap-2 text-base">
                {party.polo === "ATIVO" ? (
                  <Gavel className="w-5 h-5 text-blue-600" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-red-600" />
                )}
                <span
                  className={
                    party.polo === "ATIVO" ? "text-blue-700 dark:text-blue-300" : "text-red-700 dark:text-red-300"
                  }
                >
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
              <CardDescription className="font-semibold text-foreground">{party.name ?? party.nome}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {party.document_number && (
                <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                  <KV
                    label="Documento"
                    value={
                      <p className="font-mono text-sm">
                        {party.document_type}: {party.document_number}
                      </p>
                    }
                  />
                </div>
              )}
              {reps.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Representantes Legais ({reps.length})
                  </h4>
                  <div className="space-y-3">
                    {reps.map((rep, idx) => (
                      <div key={idx} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-sm">{rep.nome}</p>
                              <Badge variant="secondary" className="text-xs">
                                {rep.tipoRepresentacao}
                              </Badge>
                            </div>
                            {rep.oab && <KV label="OAB" value={<span className="font-mono">{rep.oab}</span>} />}
                            {rep.cadastroReceitaFederal && rep.cadastroReceitaFederal.length > 0 && (
                              <KV
                                label={rep.cadastroReceitaFederal[0].tipo || "Documento"}
                                value={<span className="font-mono">{rep.cadastroReceitaFederal[0].numero}</span>}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
      {parties.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma parte encontrada</p>
        </div>
      )}
    </div>
  )
}