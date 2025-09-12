"use client"

import { useMemo } from "react"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import type { CalendarDay, TransitAnalysis } from "../types"
import { Badge } from "../../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Button } from "../../ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip"
import { cn } from "@/src/common/utils/utils"

interface TransitCalendarProps {
  cases: TransitAnalysis[]
  currentDate: Date
  onDateChange: (date: Date) => void
  onSelectCase: (caseId: string) => void
}

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export function TransitCalendar({ cases, currentDate, onDateChange, onSelectCase }: TransitCalendarProps) {
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Start from the first Sunday of the week containing the first day
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    // End at the last Saturday of the week containing the last day
    const endDate = new Date(lastDay)
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

    const days: CalendarDay[] = []
    const currentDateObj = new Date(startDate)

    while (currentDateObj <= endDate) {
      const dateStr = currentDateObj.toISOString().split("T")[0]
      const casesForDay = cases.filter((case_) => {
        if (!case_.transit_date) return false
        const caseDate = new Date(case_.transit_date).toISOString().split("T")[0]
        return caseDate === dateStr
      })

      days.push({
        date: new Date(currentDateObj),
        cases: casesForDay,
        isCurrentMonth: currentDateObj.getMonth() === month,
        isToday: currentDateObj.toDateString() === new Date().toDateString(),
      })

      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }

    return days
  }, [cases, currentDate])

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    onDateChange(newDate)
  }

  const formatCaseTooltip = (case_: TransitAnalysis) => {
    return (
      <div className="space-y-1">
        <p className="font-mono text-xs">{case_.process?.process_number}</p>
        <p className="font-medium">{case_.process?.classe_processual}</p>
        <p className="text-xs text-muted-foreground">{case_.process?.assunto}</p>
        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">{case_.status}</Badge>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 h-full overflow-auto">
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Calendário de Trânsito em Julgado
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-lg font-semibold min-w-[200px] text-center">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </div>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {WEEKDAYS.map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "min-h-[80px] p-1 border rounded-lg transition-colors",
                    day.isCurrentMonth ? "bg-card" : "bg-muted/30",
                    day.isToday && "ring-2 ring-primary/50",
                    day.cases.length > 0 && "bg-primary/5 border-primary/20",
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-sm",
                        day.isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                        day.isToday && "font-bold text-primary",
                      )}
                    >
                      {day.date.getDate()}
                    </span>
                    {day.cases.length > 0 && (
                      <Badge variant="secondary" className="text-xs h-5">
                        {day.cases.length}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    {day.cases.slice(0, 2).map((case_) => (
                      <Tooltip key={case_.id}>
                        <TooltipTrigger asChild>
                          <div
                            className="p-1 bg-primary/10 rounded text-xs cursor-pointer hover:bg-primary/20 transition-colors"
                            onClick={() => onSelectCase(case_.id)}
                          >
                            <div className="truncate font-mono text-[10px]">
                              {case_.process?.process_number?.split("-")[0]}
                            </div>
                            <div className="truncate text-[10px]">{case_.process?.classe_processual}</div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          {formatCaseTooltip(case_)}
                        </TooltipContent>
                      </Tooltip>
                    ))}

                    {day.cases.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">+{day.cases.length - 2} mais</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TooltipProvider>

          <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/10 border border-primary/20 rounded"></div>
              <span>Dias com trânsito confirmado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary/50 rounded"></div>
              <span>Hoje</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
