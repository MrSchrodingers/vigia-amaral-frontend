"use client"

import { MessageSquare, Search, Bot, Scale, Settings, HelpCircle, Gavel } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "../../utils/utils"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"

interface SidebarProps {
  currentView: "messages" | "processes" | "transit"
  onViewChange: (view: "messages" | "processes" | "transit") => void
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
//    {
//      id: "messages" as const,
//      label: "Negociações",
//      icon: MessageSquare,
//      description: "Mensagens e negociações",
//    },
    {
      id: "processes" as const,
      label: "Processos",
      icon: Search,
      description: "Busca e análise",
    },
    {
      id: "transit" as const,
      label: "Transitos em julgado",
      icon: Gavel,
    },
  ]

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">VigIA</h1>
            <p className="text-xs text-muted-foreground">Centralização de processos Jus.br e Agentes de IA</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs opacity-70">{item.description}</div>
                </div>
              </Button>
            )
          })}
        </div>

        <Separator className="my-4" />

        {/* Secondary Actions */}
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="w-4 h-4" />
            Configurações
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <HelpCircle className="w-4 h-4" />
            Ajuda
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}
