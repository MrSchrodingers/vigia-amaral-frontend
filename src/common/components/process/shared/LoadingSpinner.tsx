import { Loader2 } from "lucide-react"

export const LoadingSpinner = ({ text }: { text: string }) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      <p className="mt-4 text-muted-foreground">{text}</p>
    </div>
  </div>
)