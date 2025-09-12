import { Scale, FileText, Brain, Users } from "lucide-react"

export const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center bg-muted/20">
    <div className="text-center max-w-lg px-6">
      <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <Scale className="w-12 h-12 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-4">Sistema de Gestão de Processos</h3>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Selecione um processo da lista para visualizar detalhes, ou consulte um novo processo
        digitando o número no campo de busca.
      </p>
      <div className="grid grid-cols-3 gap-6 text-sm text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span>Documentos</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <span>Análise IA</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <span>Partes</span>
        </div>
      </div>
    </div>
  </div>
)