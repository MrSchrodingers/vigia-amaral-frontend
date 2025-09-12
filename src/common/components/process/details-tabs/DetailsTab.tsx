import type React from "react"
import { Hash, Building2, Calendar, Shield, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { formatDate } from "../../shared/utils/shared_utils"
import type { LegalProcessDetails } from "../types"
import { KV } from "../shared/KV"

interface DetailsTabProps {
  process: LegalProcessDetails
}

export const DetailsTab: React.FC<DetailsTabProps> = ({ process }) => {
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
    <div className="space-y-6">
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" /> Classificação Processual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <KV
                label="Classe Processual"
                value={
                  <div>
                    <p className="font-semibold">{process.classe_processual}</p>
                    {process.classe_codigo && (
                      <p className="text-xs text-muted-foreground">Código: {process.classe_codigo}</p>
                    )}
                  </div>
                }
              />
              <KV
                label="Assunto"
                value={
                  <div>
                    <p className="font-semibold">{process.assunto}</p>
                    {process.assunto_codigo && (
                      <p className="text-xs text-muted-foreground">Código: {process.assunto_codigo}</p>
                    )}
                  </div>
                }
              />
            </div>
            {process.assunto_hierarquia && (
              <div>
                <KV
                  label="Hierarquia do Assunto"
                  value={<p className="text-sm leading-relaxed">{process.assunto_hierarquia}</p>}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" /> Informações do Tribunal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <KV
                label="Tribunal"
                value={
                  <div>
                    <p className="font-semibold">{process.tribunal_nome}</p>
                    <p className="text-xs text-muted-foreground">Sigla: {process.tribunal}</p>
                    {process.tribunal_jtr && (
                      <p className="text-xs text-muted-foreground">JTR: {process.tribunal_jtr}</p>
                    )}
                  </div>
                }
              />
              <KV label="Segmento" value={<p className="font-semibold">{process.tribunal_segmento}</p>} />
            </div>
            <div className="space-y-3">
              <KV
                label="Grau de Jurisdição"
                value={
                  <div>
                    <p className="font-semibold">{process.degree_nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {process.degree_sigla} {process.degree_numero ? `- Número: ${process.degree_numero}` : ""}
                    </p>
                  </div>
                }
              />
              <KV
                label="Órgão Julgador"
                value={
                  <div>
                    <p className="font-semibold">{process.orgao_julgador}</p>
                    {process.orgao_julgador_id && (
                      <p className="text-xs text-muted-foreground">ID: {process.orgao_julgador_id}</p>
                    )}
                  </div>
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Datas e Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              {process.start_date && (
                <KV label="Data de Início" value={<p className="font-semibold">{formatDate(process.start_date)}</p>} />
              )}
              {process.last_update && (
                <KV
                  label="Última Atualização"
                  value={<p className="font-semibold">{formatDate(process.last_update)}</p>}
                />
              )}
            </div>
            <div className="space-y-3">
              {process.distribuicao_first_datetime && (
                <KV
                  label="Data de Distribuição"
                  value={<p className="font-semibold">{formatDate(process.distribuicao_first_datetime)}</p>}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" /> Configurações e Permissões
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {process.permite_peticionar && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Permite Peticionar
              </Badge>
            )}
            {process.ativo && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Processo Ativo
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
  )
}