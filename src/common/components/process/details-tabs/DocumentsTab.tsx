import type React from "react"
import { FileText, Eye, Download, Hash, BarChart3, Calendar } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip"
import { Button } from "../../ui/button"
import { Badge } from "../../ui/badge"
import { formatDateShort } from "../../shared/utils/shared_utils"
import type { LegalProcessDetails } from "../types"
import type { ProcessDocument } from "../../../interfaces/types"
import api from "../../../services/api.service"

interface DocumentsTabProps {
  process: LegalProcessDetails
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ process }) => {
  const documents = process.documents ?? []

  const handleDownload = async (doc: ProcessDocument) => {
    try {
      const response = await api.get(`/processes/${process.id}/documents/${doc.id}/download`, { responseType: "blob" })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", doc.name)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  const handleView = (doc: ProcessDocument) => {
    const url = `/processes/${process.id}/documents/${doc.id}/view`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground line-clamp-2 mb-2">{doc.name}</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        <span>{doc.document_type}</span>
                      </div>
                      {typeof doc.file_size === "number" && (
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                        </div>
                      )}
                      {doc.juntada_date && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDateShort(doc.juntada_date)}</span>
                        </div>
                      )}
                      {typeof doc.pages === "number" && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{doc.pages} páginas</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {typeof doc.sequence === "number" && (
                        <Badge variant="outline" className="text-xs">
                          Seq. {doc.sequence}
                        </Badge>
                      )}
                      {doc.secrecy_level && (
                        <Badge variant="outline" className="text-xs">
                          {doc.secrecy_level}
                        </Badge>
                      )}
                      {doc.type_name && (
                        <Badge variant="secondary" className="text-xs">
                          {doc.type_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => handleView(doc)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visualizar</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(doc)}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Baixar</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {documents.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum documento encontrado</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}