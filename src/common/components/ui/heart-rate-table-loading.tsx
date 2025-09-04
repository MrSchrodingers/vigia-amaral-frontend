import { TableBody, TableCell, TableRow } from "@/src/common/components/ui/table"
import { HeartRateLoader } from "./heart-rate-loader"

interface HeartRateTableLoadingProps {
  colSpan: number
  text?: string
  size?: "sm" | "md" | "lg"
}

export function HeartRateTableLoading({
  colSpan,
  text = "Sincronizando dados...",
  size = "md",
}: HeartRateTableLoadingProps) {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={colSpan} className="text-center py-8">
          <HeartRateLoader text={text} size={size} />
        </TableCell>
      </TableRow>
    </TableBody>
  )
}
