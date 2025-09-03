"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search, FileText, Download, Brain, Loader2, Gavel, Scale, ShieldAlert
} from "lucide-react";


import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import type { LegalProcess, LegalProcessDetails, ProcessDocument } from "../../interfaces/types";
import { cn } from "../../utils/utils";
import api from "../../services/api.service";
import { formatCurrency, formatDate } from "../shared/utils/shared_utils";
import { useProcesses } from "../../lib/hooks/useProcesses";

// --- Subcomponentes para Melhor Organização ---

/**
 * Exibe a lista de processos na barra lateral esquerda.
 */
const ProcessList = ({
  processes,
  isLoading,
  onSelectProcess,
  selectedProcessId
}: {
  processes: LegalProcess[] | undefined;
  isLoading: boolean;
  onSelectProcess: (id: string) => void;
  selectedProcessId: string | null;
}) => {
  if (isLoading) {
    return (
      <div className="p-2 space-y-2">
        {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    );
  }

  if (!processes || processes.length === 0) {
    return <div className="p-4 text-center text-sm text-muted-foreground">Nenhum processo encontrado.</div>;
  }

  return (
    <div className="p-2">
      {processes.map((process) => (
        <Card
          key={process.id}
          className={cn(
            "mb-2 cursor-pointer transition-colors hover:bg-accent/50",
            selectedProcessId === process.id && "ring-2 ring-primary",
          )}
          onClick={() => onSelectProcess(process.id)}
        >
          <CardContent className="p-4">
            <p className="font-mono text-sm font-medium">{process.process_number}</p>
            <p className="text-sm font-medium line-clamp-2 mt-1">{process.classe_processual || 'Classe não definida'}</p>
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-sm font-semibold text-primary">
                {formatCurrency(process.valor_causa ?? 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/**
 * Exibe os detalhes completos de um processo selecionado.
 */
const ProcessDetails = ({ process, onRunAIJury, isAnalyzing }: { process: LegalProcessDetails; onRunAIJury: () => void, isAnalyzing: boolean }) => {

  const handleDownload = async (doc: ProcessDocument) => {
    try {
      const response = await api.get(`/api/processes/${process.id}/documents/${doc.id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      // Aqui você pode usar uma biblioteca de toast para notificar o usuário
    }
  };
  
  const getPartyByType = (polo: 'ATIVO' | 'PASSIVO') => process.parties.find(p => p.polo === polo);

  return (
    <TooltipProvider>
      {/* Header */}
      <div className="p-6 border-b border-border bg-card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">{process.classe_processual}</h2>
            <p className="font-mono text-sm text-muted-foreground">{process.process_number}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge>{process.status || 'N/A'}</Badge>
          </div>
        </div>

        {/* Informações Principais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Autor</p>
              <p className="font-medium text-sm truncate">{getPartyByType('ATIVO')?.name || 'N/A'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Réu</p>
              <p className="font-medium text-sm truncate">{getPartyByType('PASSIVO')?.name || 'N/A'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Valor da Causa</p>
              <p className="font-semibold text-primary">{formatCurrency(process.valor_causa ?? 0)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">Órgão Julgador</p>
              <p className="font-medium text-sm truncate">{process.orgao_julgador || 'N/A'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={onRunAIJury} disabled={isAnalyzing}>
            {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
            {isAnalyzing ? "Analisando..." : "Análise com IA"}
          </Button>
        </div>
      </div>

      {/* Abas com conteúdo detalhado */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="movements" className="h-full flex flex-col">
          <TabsList className="mx-6 mt-4">
            <TabsTrigger value="movements">Movimentações</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="parties">Partes</TabsTrigger>
            <TabsTrigger value="analysis">Análise IA</TabsTrigger>
          </TabsList>

          {/* Movimentações */}
          <TabsContent value="movements" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-6 pb-6">
              <div className="relative pl-6">
                <div className="absolute left-0 top-0 h-full w-px bg-border" />
                {process.movements.map((movement) => (
                  <div key={movement.id} className="relative flex items-start gap-4 pb-6">
                    <div className="absolute left-[-24px] top-1 flex h-6 w-6 items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                    </div>
                    <div className="pt-1">
                      <p className="font-medium text-sm">{movement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(movement.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Documentos */}
          <TabsContent value="documents" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-6 pb-6">
              <div className="space-y-3">
                {process.documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                        <div className="overflow-hidden">
                          <p className="font-medium truncate">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.document_type} • {doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : ''} • {formatDate(doc.juntada_date)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleDownload(doc)}><Download className="w-4 h-4" /></Button></TooltipTrigger>
                            <TooltipContent><p>Baixar Documento</p></TooltipContent>
                        </Tooltip>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          {/* Partes */}
          <TabsContent value="parties" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full px-6 pb-6">
              <div className="space-y-4">
                {process.parties.map(party => (
                  <Card key={party.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        {party.polo === 'ATIVO' ? <Gavel className="w-5 h-5 text-blue-500" /> : <ShieldAlert className="w-5 h-5 text-red-500" />}
                        {party.polo}
                      </CardTitle>
                      <CardDescription>{party.name}</CardDescription>
                    </CardHeader>
                    {party.representatives.length > 0 && (
                      <CardContent>
                        <h4 className="font-semibold text-sm mb-2">Representantes</h4>
                        <ul className="space-y-1 list-disc pl-5">
                          {party.representatives.map((rep, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              {rep.nome} ({rep.tipoRepresentacao})
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Análise de IA */}
          <TabsContent value="analysis" className="flex-1 overflow-hidden">
             <ScrollArea className="h-full px-6 pb-6">
                {process.analysis_content ? (
                    <Card>
                       <CardHeader><CardTitle>Análise Estratégica</CardTitle></CardHeader>
                       <CardContent className="prose dark:prose-invert max-w-none">
                          <h4>Ação Recomendada</h4>
                          <p>{process.analysis_content?.acao_recomendada?.proxima_acao}</p>
                          <h4>Estratégia</h4>
                          <p>{process.analysis_content?.acao_recomendada?.estrategia}</p>
                          <h4>Racional Jurídico</h4>
                          <p>{process.analysis_content?.racional_juridico}</p>
                       </CardContent>
                    </Card>
                ) : (
                    <div className="text-center py-10">
                        <p>Nenhuma análise de IA foi executada para este processo ainda.</p>
                        <Button onClick={onRunAIJury} disabled={isAnalyzing} className="mt-4">
                           {isAnalyzing ? "Analisando..." : "Executar Análise Agora"}
                        </Button>
                    </div>
                )}
             </ScrollArea>
          </TabsContent>

        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export function ProcessSearchView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  const { processes, isLoading: isLoadingList, syncProcess, isSyncing, runAIJury, isAnalyzing } = useProcesses();

  const { data: selectedProcessDetails, isLoading: isLoadingDetails } = useQuery<LegalProcessDetails>({
    queryKey: ['process', selectedProcessId],
    // A função de query agora é apenas para buscar do cache. A sincronização é uma ação (mutation).
    queryFn: async () => {
      const { data } = await api.get(`/api/processes/${selectedProcessId}`);
      return data;
    },
    enabled: !!selectedProcessId,
  });

  const handleSelectProcess = (processId: string) => {
    const process = processes?.find(p => p.id === processId);
    if(process) {
      setSelectedProcessId(process.id);
      syncProcess(process.process_number);
    }
  };
  
  const handleRunAIJury = () => {
    if (selectedProcessId) {
        runAIJury(selectedProcessId);
    }
  };

  const filteredProcesses = useMemo(() => {
    if (!processes) return [];
    return processes.filter(p =>
      p.process_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.classe_processual?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [processes, searchTerm]);

  return (
    <div className="flex h-full">
      {/* Coluna da Esquerda: Busca e Lista */}
      <div className="w-1/3 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Busca de Processos</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por número do processo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <ProcessList
            processes={filteredProcesses}
            isLoading={isLoadingList}
            onSelectProcess={handleSelectProcess}
            selectedProcessId={selectedProcessId}
          />
        </ScrollArea>
      </div>

      {/* Coluna da Direita: Detalhes */}
      <div className="flex-1 flex flex-col">
        {isSyncing || (selectedProcessId && isLoadingDetails) ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : selectedProcessDetails ? (
          <ProcessDetails process={selectedProcessDetails} onRunAIJury={handleRunAIJury} isAnalyzing={isAnalyzing}/>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Scale className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Busque ou Selecione um Processo</h3>
              <p className="text-muted-foreground max-w-sm">
                Use a busca para encontrar um processo ou selecione um da lista para sincronizar os dados e ver todos os detalhes.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}