import type React from "react"

export const ListHelper = ({ items }: { items?: string[] }) =>
  items && items.length > 0 ? (
    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  ) : (
    <p className="text-sm text-muted-foreground">—</p>
  )