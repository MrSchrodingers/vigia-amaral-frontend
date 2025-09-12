import type React from "react"
import { Brain, TrendingUp, ListChecks, Scale, BookMarked, Landmark, Gavel, Calendar, LinkIcon } from "lucide-react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../../ui/card"
import { Progress } from "../../ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion"
import { formatDate } from "../../shared/utils/shared_utils"
import type { AIAction } from "../../../interfaces/types"
import type { LegalProcessDetails } from "../types"
import { ListHelper } from "../shared/ListHelper"
import { KV } from "../shared/KV"
import { Button } from "../../ui/button"
import { Loader2 } from "lucide-react"
import { Badge } from "../../ui/badge"

interface AnalysisTabProps {
  process: LegalProcessDetails
  onRunAIJury: () => void
  isAnalyzing: boolean
}

export const AnalysisTab: React.FC<AnalysisTabProps> = ({ process, onRunAIJury, isAnalyzing }) => {
  const analysis = process.analysis_content
  if (!analysis) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Brain className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-3">Análise de IA Não Disponível</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto leading-relaxed">
          Execute uma análise para obter insights estratégicos e recomendações jurídicas.
        </p>
        <Button onClick={onRunAIJury} disabled={isAnalyzing} size="lg">
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analisando../...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" /> Executar Análise Agora
            </>
          )}
        </Button>
      </div>
    )
  }

  const arb = (analysis?.arbiter ?? {}) as any
  const confidence = Number((analysis?.confidence_score ?? arb?.confidence_score ?? 0) as number)
  const action = (analysis?.acao_recomendada ?? arb?.acao_recomendada) as AIAction | undefined
  const racional = (analysis?.racional_juridico ?? arb?.racional_juridico ?? "") as string

  const legal = analysis?.legal_context as any
  const extr = analysis?.extractions as any
  const opinions = analysis?.opinions as any
  const summary = analysis?.summary as any
  const timeline = (analysis?.inputs?.timeline ?? []) as Array<{
    data?: string
    tipo?: string
    descricao?: string
    doc_ref?: string
  }>
  const evidence = (analysis?.inputs?.evidence_index ?? { docs: {}, moves: [] }) as any
  const evidenceDocs = evidence?.docs ?? {}

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary hover:shadow-sm transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" /> Análise Estratégica com IA
          </CardTitle>
          <CardDescription>Análise automatizada baseada nos documentos e movimentações do processo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Nível de Confiança
              </span>
              <span className="text-lg font-bold text-primary">
                {Math.round(Math.max(0, Math.min(100, confidence * 100)))}%
              </span>
            </div>
            <Progress value={Math.max(0, Math.min(100, confidence * 100))} className="h-3" />
          </div>
          {(action?.proxima_acao || action?.estrategia) && (
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-green-600" /> Ação Recomendada
              </h4>
              <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                {action?.proxima_acao && (
                  <p className="text-sm font-medium mb-2 text-green-800 dark:text-green-200">{action.proxima_acao}</p>
                )}
                {action?.estrategia && (
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>Estratégia: </strong>
                    {action.estrategia}
                  </p>
                )}
              </div>
            </div>
          )}
          {racional && (
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" /> Fundamentação Jurídica
              </h4>
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{racional}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {summary && (
        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookMarked className="w-4 h-4" /> Resumo Sintetizado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <KV
              label="Resumo Executivo"
              value={
                <p className="text-sm text-muted-foreground leading-relaxed">{summary.sumario_executivo || "—"}</p>
              }
            />
            {summary.status_e_proximos_passos && (
              <div className="mt-4">
                <h5 className="text-sm font-medium text-foreground mb-3">Status e Próximos Passos</h5>
                <div className="rounded-lg border p-4 space-y-3">
                  <KV
                    label="Status Atual"
                    value={<span className="text-sm">{summary.status_e_proximos_passos.status_atual || "—"}</span>}
                  />
                  <KV label="Tarefas" value={<ListHelper items={summary.status_e_proximos_passos.tarefas} />} />
                  <KV label="Riscos" value={<ListHelper items={summary.status_e_proximos_passos.riscos} />} />
                  <KV
                    label="Oportunidades"
                    value={<ListHelper items={summary.status_e_proximos_passos.oportunidades} />}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {(legal || extr) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {legal && (
            <Card className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="w-4 h-4" /> Contexto Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <KV label="Causa de Pedir" value={<span className="text-sm">{legal.causa_de_pedir || "—"}</span>} />
                <KV label="Tese da Autora" value={<span className="text-sm">{legal.tese_autora || "—"}</span>} />
                <KV label="Tese do Réu" value={<span className="text-sm">{legal.tese_reu || "—"}</span>} />
                <KV label="Pontos Controversos" value={<ListHelper items={legal.pontos_controversos} />} />
                <KV label="Provas Relevantes" value={<ListHelper items={legal.provas_relevantes} />} />
                <KV label="Riscos" value={<ListHelper items={legal.riscos} />} />
                <KV label="Oportunidades" value={<ListHelper items={legal.oportunidades} />} />
                <KV label="Marcos Procedimentais" value={<ListHelper items={legal.marcos_procedimentais} />} />
              </CardContent>
            </Card>
          )}
          {extr && (
            <Card className="hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-4 h-4" /> Extrações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <KV label="Pedidos da Autora" value={<ListHelper items={extr.pedidos_autora} />} />
                <KV label="Defesas do Réu" value={<ListHelper items={extr.defesas_reu} />} />
                <KV label="Valores Reclamados" value={<ListHelper items={extr.valores_reclamados} />} />
                <KV label="Valores Comprovados" value={<ListHelper items={extr.valores_comprovados} />} />
                <KV label="Precedentes Citados" value={<ListHelper items={extr.precedentes_citados} />} />
                <KV label="Prazos Pendentes" value={<ListHelper items={extr.prazos_pendentes} />} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {opinions && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {opinions.conservadora && (
            <Card className="border-l-4 border-l-amber-500 hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-300">Opinião — Conservadora</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <KV
                  label="Tese"
                  value={<p className="text-sm text-muted-foreground">{opinions.conservadora.tese || "—"}</p>}
                />
                <KV label="Pontos Fortes" value={<ListHelper items={opinions.conservadora.pontos_fortes} />} />
                <KV label="Pontos Fracos" value={<ListHelper items={opinions.conservadora.pontos_fracos} />} />
                <KV
                  label="Faixa de Acordo"
                  value={<span className="text-sm">{opinions.conservadora.faixa_acordo_recomendada || "—"}</span>}
                />
                <KV label="Recomendações" value={<ListHelper items={opinions.conservadora.recomendacoes} />} />
              </CardContent>
            </Card>
          )}
          {opinions.estrategica && (
            <Card className="border-l-4 border-l-indigo-500 hover:shadow-sm transition-shadow">
              <CardHeader>
                <CardTitle className="text-indigo-700 dark:text-indigo-300">Opinião — Estratégica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <KV
                  label="Tese"
                  value={<p className="text-sm text-muted-foreground">{opinions.estrategica.tese || "—"}</p>}
                />
                <KV label="Pontos Fortes" value={<ListHelper items={opinions.estrategica.pontos_fortes} />} />
                <KV label="Pontos Fracos" value={<ListHelper items={opinions.estrategica.pontos_fracos} />} />
                <KV
                  label="Faixa de Acordo"
                  value={<span className="text-sm">{opinions.estrategica.faixa_acordo_recomendada || "—"}</span>}
                />
                <KV label="Recomendações" value={<ListHelper items={opinions.estrategica.recomendacoes} />} />
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {arb && (arb.referencias?.length || arb.confidence_score !== undefined) && (
        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="w-4 h-4" /> Júri / Árbitro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <KV
              label="Confiança do Árbitro"
              value={
                <span className="text-sm">
                  {arb.confidence_score !== undefined
                    ? `${Math.round((arb.confidence_score ?? 0) * 100)}%`
                    : "—"}
                </span>
              }
            />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Referências</p>
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
      {(timeline?.length || evidence?.moves?.length) && (
        <Card className="hover:shadow-sm transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Timeline & Evidências
            </CardTitle>
            <CardDescription>Eventos consolidados e referência cruzada a documentos</CardDescription>
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
                        <div key={idx} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground">{formatDate(it.data ?? "")}</span>
                            <Badge variant="outline" className="text-xs">
                              {it.tipo || "MOVIMENTO"}
                            </Badge>
                          </div>
                          <p className="text-sm mt-1">{it.descricao}</p>
                          {doc && (
                            <div className="flex items-center gap-2 mt-2 text-xs">
                              <LinkIcon className="w-3 h-3" />
                              {doc.url ? (
                                <a
                                  href={doc.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="underline hover:text-primary"
                                >
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
                    {timeline.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento na timeline</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="idx">
                <AccordionTrigger>Índice de Evidências</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {Object.entries(evidenceDocs).length > 0 ? (
                      Object.entries(evidenceDocs).map(([docId, meta]: any) => (
                        <div key={docId} className="p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                          <p className="text-sm font-medium">{meta.label || docId}</p>
                          <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
                            {meta.data && <span>Data: {formatDate(meta.data)}</span>}
                            {meta.tipo && <span>Tipo: {meta.tipo}</span>}
                          </div>
                          {meta.url && (
                            <div className="mt-2">
                              <a
                                className="text-xs underline inline-flex items-center gap-1 hover:text-primary"
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
                      <p className="text-sm text-muted-foreground text-center py-4">Nenhuma evidência indexada</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              {analysis?.raw_agent_outputs && (
                <AccordionItem value="raw">
                  <AccordionTrigger>Depuração (Saídas dos Agentes)</AccordionTrigger>
                  <AccordionContent>
                    <pre className="text-xs overflow-auto p-3 rounded bg-muted/50 max-h-96">
                      {JSON.stringify(analysis.raw_agent_outputs, null, 2)}
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      )}
      {(analysis.generated_at || (analysis as any).process_number) && (
        <div className="text-xs text-muted-foreground text-center py-2 border-t">
          {analysis.generated_at && <span>Gerado em {formatDate(analysis.generated_at)}</span>}
          {(analysis as any).process_number && (
            <span className="ml-2">• Processo: {(analysis as any).process_number}</span>
          )}
        </div>
      )}
    </div>
  )
}