import type React from "react"

export const KV = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2 border-b border-border/50 last:border-0">
    <div className="text-sm font-medium text-muted-foreground">{label}</div>
    <div className="sm:col-span-2 text-sm text-foreground">{value ?? "—"}</div>
  </div>
)