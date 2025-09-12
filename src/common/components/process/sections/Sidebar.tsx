import type React from "react"
import { Search, Scale, Gavel, User, Filter, Loader2 } from "lucide-react"
import { ProcessList } from "./ProcessList"
import type { GroupByOption, LegalProcessWithParties } from "../types"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Separator } from "../../ui/separator"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"

interface SidebarProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  filterTerm: string
  setFilterTerm: (value: string) => void
  groupBy: GroupByOption 
  setGroupBy: (value: GroupByOption) => void
  handleSyncNewProcess: (e: React.FormEvent) => void
  isSyncing: boolean
  processes: LegalProcessWithParties[] | undefined
  isLoadingList: boolean
  handleSelectProcess: (process: LegalProcessWithParties) => void
  selectedProcessId: string | null
}

export const Sidebar: React.FC<SidebarProps> = ({
  searchTerm,
  setSearchTerm,
  filterTerm,
  setFilterTerm,
  groupBy,
  setGroupBy,
  handleSyncNewProcess,
  isSyncing,
  processes,
  isLoadingList,
  handleSelectProcess,
  selectedProcessId,
}) => (
  <div className="flex flex-col h-full">
    <div className="p-4 lg:p-6 border-b bg-card/50">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Scale className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-bold text-foreground">Processos Jurídicos</h2>
      </div>
      <form onSubmit={handleSyncNewProcess} className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Consultar novo processo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit" disabled={!searchTerm.trim() || isSyncing} size="sm">
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </Button>
        </div>
      </form>
      <Separator className="my-4" />
      <div className="space-y-3">
        <div>
          <Tabs value={groupBy} onValueChange={(value) => setGroupBy(value as GroupByOption)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="processo" className="text-xs">
                <Gavel className="w-4 h-4 mr-1" />
                Por Processo
              </TabsTrigger>
              <TabsTrigger value="autor" className="text-xs">
                <User className="w-4 h-4 mr-1" />
                Por Autor
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Filtrar na lista..."
            className="pl-10"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
    <ProcessList
      processes={processes}
      isLoading={isLoadingList}
      onSelectProcess={handleSelectProcess}
      selectedProcessId={selectedProcessId}
      filterTerm={filterTerm}
      groupBy={groupBy}
    />
  </div>
)