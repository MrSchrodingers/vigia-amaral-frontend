"use client"
import { Scale, FileSearch } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Scale className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-3">Selecione um Caso</h3>
        <p className="text-muted-foreground leading-relaxed">
          Escolha um caso de trânsito em julgado na lista ao lado para visualizar os detalhes da análise.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
          <FileSearch className="w-4 h-4" />
          <span>Use os filtros para encontrar casos específicos</span>
        </div>
      </div>
    </div>
  )
}
