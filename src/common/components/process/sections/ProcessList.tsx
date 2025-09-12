import type React from "react"
import { useMemo } from "react"
import { Gavel, User, ChevronRight, Building2, Calendar, Scale } from "lucide-react"
import type { GroupByOption, LegalProcessWithParties } from "../types"
import { findAuthorName, groupData } from "../utils"
import { Card, CardContent } from "../../ui/card"
import { Skeleton } from "../../ui/skeleton"
import { ScrollArea } from "../../ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion"
import { cn } from "@/src/common/utils/utils"
import { formatCurrency, formatDateShort } from "../../shared/utils/shared_utils"
import { Badge } from "../../ui/badge"

const grouperStrategies: Record<GroupByOption, (process: LegalProcessWithParties) => string | undefined> = {
  processo: (p) => p.process_number,
  autor: (p) => findAuthorName(p),
}

interface ProcessListProps {
  processes: LegalProcessWithParties[] | undefined
  isLoading: boolean
  onSelectProcess: (process: LegalProcessWithParties) => void
  selectedProcessId: string | null
  filterTerm: string
  groupBy: GroupByOption
}

export const ProcessList: React.FC<ProcessListProps> = ({
  processes,
  isLoading,
  onSelectProcess,
  selectedProcessId,
  filterTerm,
  groupBy,
}) => {
  const groupedAndFilteredProcesses = useMemo(() => {
    if (!processes) return {}

    // 1. Filtra os processos primeiro
    const term = filterTerm.toLowerCase()
    const filtered = processes.filter((p) => {
      const nProcess = p.process_number?.toLowerCase?.() ?? ""
      const classe = (p.classe_processual ?? "").toLowerCase()
      const assunto = (p.assunto ?? "").toLowerCase()
      const autor = findAuthorName(p).toLowerCase()
      return nProcess.includes(term) || classe.includes(term) || assunto.includes(term) || autor.includes(term)
    })

    // 2. Seleciona a estratégia de agrupamento e agrupa os dados
    const getKeyFn = grouperStrategies[groupBy]
    return groupData(filtered, getKeyFn)
  }, [processes, filterTerm, groupBy])

  const openAccordionItem = useMemo(() => {
    if (!selectedProcessId || !processes) return undefined
    const selected = processes.find((p) => p.id === selectedProcessId)
    if (!selected) return undefined
    return groupBy === "autor" ? findAuthorName(selected) : selected.process_number
  }, [selectedProcessId, processes, groupBy])

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

  const hasResults = Object.keys(groupedAndFilteredProcesses).length > 0
  if (!hasResults) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <Scale className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">
          {filterTerm ? "Nenhum resultado encontrado" : "Nenhum processo cadastrado"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {filterTerm
            ? "Tente ajustar os filtros ou termos de busca."
            : "Consulte um novo processo usando o campo de busca acima."}
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-3">
        <Accordion type="single" collapsible className="w-full" value={openAccordionItem}>
          {Object.entries(groupedAndFilteredProcesses).map(([groupId, processesInGroup]) => {
            const sorted = [...processesInGroup].sort((a, b) => (b.start_date || "").localeCompare(a.start_date || ""))
            const mainProcess = sorted[0]
            const isGroupedByProcess = groupBy === "processo"
            const triggerTitle = isGroupedByProcess ? mainProcess.process_number : groupId
            const TriggerIcon = isGroupedByProcess ? Gavel : User
            const description = isGroupedByProcess
              ? sorted.map((p) => p.classe_processual).filter(Boolean).join(" → ")
              : `${sorted.length} processo(s) encontrado(s)`

            return (
              <AccordionItem key={groupId} value={groupId} className="border-none">
                <Card
                  className={cn(
                    "mb-2 transition-all duration-300 hover:shadow-md",
                    selectedProcessId === mainProcess.id && "ring-2 ring-primary/20 bg-primary/5"
                  )}
                >
                  <AccordionTrigger
                    className="p-4 hover:no-underline text-left data-[state=open]:bg-muted/30"
                    onClick={() => onSelectProcess(mainProcess)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className={cn(
                          "p-2 rounded-lg flex-shrink-0",
                          isGroupedByProcess ? "bg-blue-100 dark:bg-blue-900/30" : "bg-green-100 dark:bg-green-900/30"
                        )}
                      >
                        <TriggerIcon
                          className={cn(
                            "w-4 h-4",
                            isGroupedByProcess
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-green-600 dark:text-green-400"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "font-semibold truncate text-sm",
                            isGroupedByProcess ? "font-mono text-primary" : "text-foreground"
                          )}
                        >
                          {triggerTitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
                        {mainProcess.valor_causa && (
                          <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">
                            {formatCurrency(mainProcess.valor_causa)}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {sorted.length}
                        </Badge>
                        {selectedProcessId === mainProcess.id && (
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-2">
                    <div className="space-y-2 pt-3 border-t mx-2 max-h-80 overflow-y-auto">
                      {sorted.map((process) => (
                        <div
                          key={process.id}
                          className={cn(
                            "p-3 rounded-lg cursor-pointer transition-all duration-200 border",
                            selectedProcessId === process.id
                              ? "bg-primary/10 border-primary/30 shadow-sm"
                              : "hover:bg-muted/50 border-transparent hover:border-border"
                          )}
                          onClick={() => onSelectProcess(process)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              {!isGroupedByProcess && (
                                <p className="text-xs font-mono text-primary mb-1 truncate">{process.process_number}</p>
                              )}
                              <p className="text-sm font-medium text-foreground truncate">{process.classe_processual}</p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  <span className="truncate">
                                    {(process as any).degree_nome || (process as any).instance}
                                  </span>
                                </div>
                                {process.start_date && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDateShort(process.start_date)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {selectedProcessId === process.id && (
                              <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </ScrollArea>
  )
}