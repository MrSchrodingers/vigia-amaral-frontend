import { Card, CardContent } from "@/src/common/components/ui/card"
import { HeartRateLoader } from "./heart-rate-loader"

interface HeartRateCardLoadingProps {
  text?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function HeartRateCardLoading({
  text = "Processando...",
  size = "sm",
  className = "",
}: HeartRateCardLoadingProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-center p-6">
        <HeartRateLoader text={text} size={size} />
      </CardContent>
    </Card>
  )
}
