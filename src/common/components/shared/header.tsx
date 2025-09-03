"use client"

import { Bell, Search, User, LogOut, Shield, RefreshCw, Mail, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { ThemeToggle } from "../themeToggle"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdownMenu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

interface HeaderProps {
  currentView: "messages" | "processes" | "chat"
}

const viewTitles = {
  messages: "Negociações",
  processes: "Busca de Processos",
  chat: "Chat com IA",
}

const mockInboxes = [
  { id: "all", name: "Todas as Caixas", email: "" },
  { id: "nego1", name: "Negociadora 1", email: "nego1@empresa.com" },
  { id: "nego2", name: "Negociadora 2", email: "nego2@empresa.com" },
  { id: "nego3", name: "Negociadora 3", email: "nego3@empresa.com" },
  { id: "juridico", name: "Jurídico", email: "juridico@empresa.com" },
]

export function Header({ currentView }: HeaderProps) {
  const [jusBrLoginActive, setJusBrLoginActive] = useState<boolean>(false)
  const [isCheckingLogin, setIsCheckingLogin] = useState<boolean>(false)
  const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date(Date.now() - 2 * 60 * 60 * 1000)) // 2 hours ago
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [selectedInbox, setSelectedInbox] = useState<string>("all")

  const checkJusBrLogin = async () => {
    setIsCheckingLogin(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const isActive = Math.random() > 0.5
    setJusBrLoginActive(isActive)
    setIsCheckingLogin(false)
  }

  const handleRefreshLogin = async () => {
    setIsCheckingLogin(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setJusBrLoginActive(true)
    setIsCheckingLogin(false)
  }

  const handleEmailSync = async () => {
    setIsSyncing(true)
    await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate sync time
    setLastSyncDate(new Date())
    setIsSyncing(false)
  }

  const formatLastSync = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutos atrás`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hora${hours > 1 ? "s" : ""} atrás`
    } else {
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  useEffect(() => {
    checkJusBrLogin()
  }, [])

  return (
    <TooltipProvider>
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">{viewTitles[currentView]}</h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar processos, negociações..." className="pl-10" />
          </div>

          {/* Jus.br login status button */}
          <Button
            variant={jusBrLoginActive ? "outline" : "destructive"}
            size="sm"
            onClick={jusBrLoginActive ? checkJusBrLogin : handleRefreshLogin}
            disabled={isCheckingLogin}
            className="flex items-center gap-2"
          >
            {isCheckingLogin ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {isCheckingLogin ? "Verificando..." : jusBrLoginActive ? "Jus.br Ativo" : "Refazer Login"}
          </Button>

          {/* Email sync button with tooltip and inbox filter */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEmailSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isSyncing ? "Sincronizando..." : "Sync Emails"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Última sincronização: {formatLastSync(lastSyncDate)}</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  {mockInboxes.find((inbox) => inbox.id === selectedInbox)?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filtrar por Caixa de Entrada</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {mockInboxes.map((inbox) => (
                  <DropdownMenuItem
                    key={inbox.id}
                    onClick={() => setSelectedInbox(inbox.id)}
                    className={selectedInbox === inbox.id ? "bg-accent" : ""}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{inbox.name}</span>
                      {inbox.email && <span className="text-xs text-muted-foreground">{inbox.email}</span>}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">3</Badge>
          </Button>

          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Advogado Demo</p>
                  <p className="text-xs leading-none text-muted-foreground">advogado@exemplo.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  )
}
