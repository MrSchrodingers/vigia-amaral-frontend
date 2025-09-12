import DOMPurify from "dompurify"

export const SafeHtml = ({ html }: { html: string }) => {
  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  )
}