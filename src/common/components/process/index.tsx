"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Menu, Scale } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { useProcesses } from "../../lib/hooks/useProcesses"
import api from "../../services/api.service"
import type { LegalProcessDetails, LegalProcessWithParties, GroupByOption, PartyLite } from "./types"
import { toPartyLite } from "./utils"
import { Sidebar } from "./sections/Sidebar"
import { ProcessDetails } from "./sections/ProcessDetails"
import { LoadingSpinner } from "./shared/LoadingSpinner"
import { EmptyState } from "./shared/EmptyState"

export function LegalProcessManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTerm, setFilterTerm] = useState("")
  const [groupBy, setGroupBy] = useState<GroupByOption>("processo")
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [isAnalyzingTransit, setIsAnalyzingTransit] = useState(false)

  const { processes, isLoading: isLoadingList, syncProcess, isSyncing, runAIJury, isAnalyzing } = useProcesses()
  const [enrichedProcesses, setEnrichedProcesses] = useState<LegalProcessWithParties[]>([])

  const queryClient = useQueryClient()

  const { data: selectedProcessDetails, isLoading: isLoadingDetails } = useQuery<LegalProcessDetails>({
    queryKey: ["process", selectedProcessId],
    queryFn: async () => {
      const { data } = await api.get(`/processes/${selectedProcessId}`)
      return data
    },
    enabled: !!selectedProcessId,
  })

  useEffect(() => {
    if (processes) {
      const preEnrichedList = processes.map((p) => {
        const proc = p as LegalProcessWithParties

        if (proc.parties || !proc.autor_nome) {
          return proc
        }

        return {
          ...proc,
          parties: [{ name: proc.autor_nome, polo: "ATIVO" } as PartyLite],
        }
      })
      setEnrichedProcesses(preEnrichedList)
    }
  }, [processes])

  useEffect(() => {
    if (selectedProcessDetails?.parties) {
      setEnrichedProcesses((currentProcesses) =>
        currentProcesses.map((process) => {
          if (process.id === selectedProcessDetails.id) {
            return {
              ...process,
              parties: toPartyLite(selectedProcessDetails.parties as any),
            }
          }
          return process
        })
      )
    }
  }, [selectedProcessDetails])

  useEffect(() => {
    if (!selectedProcessId && enrichedProcesses && enrichedProcesses.length > 0) {
      setSelectedProcessId(enrichedProcesses[0].id)
    }
  }, [enrichedProcesses, selectedProcessId])

  const handleSelectProcess = (process: LegalProcessWithParties) => {
    setSelectedProcessId(process.id)
    setSidebarOpen(false)
  }

  const handleRunAIJury = () => {
    if (selectedProcessDetails) {
      runAIJury(selectedProcessDetails.id, {
        onSuccess: () => {
          // Invalida a query do processo para buscar os dados atualizados com a análise
          queryClient.invalidateQueries({ queryKey: ["process", selectedProcessDetails.id] })
        },
      })
    }
  }
  
  // NOVO: Função para executar a análise de trânsito em julgado
  const handleRunTransitAnalysis = async () => {
    if (!selectedProcessDetails) return;

    setIsAnalyzingTransit(true)
    try {
      const response = await api.post(`/actions/processes/${selectedProcessDetails.id}/run-transit-analysis`)
      
      // Se você usar um sistema de toast (notificações), pode usá-lo aqui.
      // Ex: toast.success("Análise de trânsito concluída com sucesso!");
      alert("Análise de trânsito concluída! O resultado foi salvo e, se aplicável, uma notificação foi enviada ao Discord.")

      console.log("Resultado da Análise de Trânsito:", response.data)
      
      // Invalida a query para que os dados do processo (com a nova análise salva) sejam recarregados
      await queryClient.invalidateQueries({ queryKey: ["process", selectedProcessId] })

    } catch (error) {
      console.error("Falha ao executar a análise de trânsito:", error)
      // Ex: toast.error("Ocorreu um erro ao analisar o trânsito do processo.");
      alert("Ocorreu um erro ao analisar o trânsito do processo.")
    } finally {
      setIsAnalyzingTransit(false)
    }
  }

  const handleSyncNewProcess = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = searchTerm.replace(/\D/g, "")
    if (clean) {
      syncProcess(clean, {
        onSuccess: (data: any[]) => {
          if (data && data.length > 0) {
            setSelectedProcessId(data[0].id)
          }
          setSearchTerm("")
          setSidebarOpen(false)
        },
        onError: (error: unknown) => {
          console.error("Falha ao sincronizar processo:", error)
        },
      })
    }
  }

  const renderMainContent = () => {
    if (isSyncing || (selectedProcessId && isLoadingDetails && !selectedProcessDetails)) {
      return (
        <LoadingSpinner text={isSyncing ? "Sincronizando com Jus.br..." : "Carregando detalhes..."} />
      )
    }
    if (selectedProcessDetails) {
      return (
        <ProcessDetails
          process={selectedProcessDetails}
          onRunAIJury={handleRunAIJury}
          isAnalyzing={isAnalyzing}
          onRunTransitAnalysis={handleRunTransitAnalysis}
          isAnalyzingTransit={isAnalyzingTransit}
        />
      )
    }
    return <EmptyState />
  }

  const sidebarProps = {
    searchTerm,
    setSearchTerm,
    filterTerm,
    setFilterTerm,
    groupBy,
    setGroupBy,
    handleSyncNewProcess,
    isSyncing,
    processes: enrichedProcesses,
    isLoadingList,
    handleSelectProcess,
    selectedProcessId,
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:flex w-96 border-r bg-card flex-col">
        <Sidebar {...sidebarProps} />
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <Sidebar {...sidebarProps} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col">
        <div className="lg:hidden flex items-center gap-3 p-4 border-b bg-card/50">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-primary" />
            <h1 className="font-semibold text-foreground">Processos Jurídicos</h1>
          </div>
          {selectedProcessDetails && (
            <div className="ml-auto">
              <Badge variant="outline" className="text-xs">
                {selectedProcessDetails.process_number}
              </Badge>
            </div>
          )}
        </div>
        {renderMainContent()}
      </div>
    </div>
  )
}