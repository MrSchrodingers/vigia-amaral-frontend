"use client"

import { useState, useEffect } from "react"
import { Calendar, Scale, Filter, Menu } from "lucide-react"
import { LoadingSpinner } from "../process/shared/LoadingSpinner"
import { TransitCalendar } from "./sections/TransitCalendar"
import { TransitCaseDetails } from "./details-tabs/TransitCaseDetails"
import { EmptyState } from "./shared/EmptyState"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent } from "../ui/card"
import { TransitCasesList } from "./sections/TransitCasesList"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { Badge } from "../ui/badge"
import { useTransitAnalyses } from "../../lib/hooks/useTransitAnalyses"

export function TransitCasesManager() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState<"list" | "calendar">("list")

  const getMonthDateRange = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  const dateRange = view === "calendar" ? getMonthDateRange(currentDate) : {};

  const {
    data: transitCases,
    isLoading,
    error,
  } = useTransitAnalyses({
    status: filterStatus,
    ...dateRange,
  });

  const selectedCase = transitCases?.find((c) => c.id === selectedCaseId)

  const filteredCases =
    transitCases?.filter((case_) => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return (
        case_.process?.process_number?.toLowerCase().includes(term) ||
        case_.process?.classe_processual?.toLowerCase().includes(term) ||
        case_.process?.assunto?.toLowerCase().includes(term) ||
        case_.justification?.toLowerCase().includes(term)
      )
    }) || []

  const confirmedCases = filteredCases.filter((c) => c.status === "Confirmado" && c.transit_date)

  useEffect(() => {
    if (!selectedCaseId && filteredCases.length > 0) {
      setSelectedCaseId(filteredCases[0].id)
    } else if (filteredCases.length === 0) {
      setSelectedCaseId(null)
    }
  }, [filteredCases, selectedCaseId])

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId)
    setSidebarOpen(false)
  }

  const renderMainContent = () => {
    if (isLoading) {
      return <LoadingSpinner text="Carregando análises de trânsito..." />
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-center">
            <div>
                <p className="text-destructive font-semibold">Erro ao carregar dados.</p>
                <p className="text-sm text-muted-foreground">Tente novamente mais tarde.</p>
            </div>
        </div>
      )
    }

    if (view === "calendar") {
      return (
        <TransitCalendar
          cases={confirmedCases}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onSelectCase={handleSelectCase}
        />
      )
    }

    if (view === "list" && selectedCase) {
      return <TransitCaseDetails case={selectedCase} />
    }

    return <EmptyState />
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-6 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-bold">Trânsito em Julgado</h2>
        </div>
        <div className="flex gap-2 mb-4">
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
            className="flex-1"
          >
            Lista
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
            className="flex-1"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Calendário
          </Button>
        </div>
        <div className="space-y-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar processos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Confirmado">Confirmado</SelectItem>
              <SelectItem value="Iminente">Iminente</SelectItem>
              <SelectItem value="Provável">Provável</SelectItem>
              <SelectItem value="Improvável">Improvável</SelectItem>
              <SelectItem value="Não Transitado">Não Transitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-primary">{confirmedCases.length}</div>
              <div className="text-xs text-muted-foreground">Confirmados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold">
                {filteredCases.length - confirmedCases.length}
              </div>
              <div className="text-xs text-muted-foreground">Outros Status</div>
            </CardContent>
          </Card>
        </div>
      </div>
      {view === "list" && (
        <TransitCasesList
          cases={filteredCases}
          selectedCaseId={selectedCaseId}
          onSelectCase={handleSelectCase}
          isLoading={isLoading}
        />
      )}
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden lg:flex w-120 border-r bg-card flex-col">{sidebarContent}</div>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>
      
      <div className="flex-1 flex flex-col min-w-0">
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
            <h1 className="font-semibold text-foreground">Trânsito em Julgado</h1>
          </div>
          {selectedCase && (
            <div className="ml-auto">
              <Badge variant="outline" className="text-xs">
                {selectedCase.process?.process_number}
              </Badge>
            </div>
          )}
        </div>
        {renderMainContent()}
      </div>
    </div>
  )
}