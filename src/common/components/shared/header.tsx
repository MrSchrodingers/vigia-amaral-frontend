"use client";

import { Bell, Search, User, LogOut, Shield, RefreshCw, Mail, Filter } from "lucide-react";
import { useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ThemeToggle } from "../themeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useAuth } from "../../providers/AuthProvider";
import { useSystem } from "../../lib/hooks/useSystem";

interface HeaderProps {
  currentView: "messages" | "processes" | "transit";
}

const viewTitles = {
  messages: "Negociações",
  processes: "Busca de Processos",
  transit: "Transitos em Julgado",
};

export function Header({ currentView }: HeaderProps) {
  const { user, logout } = useAuth();
  const { 
    jusbrStatus, 
    isCheckingStatus, 
    refreshLogin, 
    isRefreshingLogin,
    syncEmails,
    isSyncingEmails
  } = useSystem();

  const isJusbrLoading = isCheckingStatus || isRefreshingLogin;
  
  // Memoize o nome de usuário para evitar recalcular
  const userInitials = useMemo(() => {
    return user?.email?.substring(0, 2).toUpperCase() || '..';
  }, [user]);

  return (
    <TooltipProvider>
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-foreground">{viewTitles[currentView]}</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar processos, negociações..." className="pl-10" />
          </div>

          {/* Botão de Status do Jus.br Conectado à API */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={jusbrStatus?.is_active ? "outline" : "destructive"}
                size="sm"
                onClick={() => !jusbrStatus?.is_active && refreshLogin()}
                disabled={isJusbrLoading}
                className="flex items-center gap-2 w-36"
              >
                {isJusbrLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                
                {isRefreshingLogin 
                  ? "Iniciando Login..." 
                  : isCheckingStatus
                  ? "Verificando..."
                  : jusbrStatus?.is_active 
                  ? "Jus.br Ativo" 
                  : "Refazer Login"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {jusbrStatus?.is_active 
                  ? "A conexão com o PJe está ativa." 
                  : "A sessão com o PJe expirou. Clique para refazer o login."}
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Botão de Sincronia de E-mail Conectado à API */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => syncEmails()}
                  disabled={isSyncingEmails}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {isSyncingEmails ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  {isSyncingEmails ? "Sincronizando..." : "Sync Emails"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Clique para iniciar a sincronização de e-mails em segundo plano.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <ThemeToggle />

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Usuário</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}