import parse from "html-react-parser"
import { useEffect, useState } from "react"

type HtmlParserProps = {
  html: string
}

export const HtmlParser = ({ html }: HtmlParserProps) => {
  const [mounted, setMounted] = useState<boolean>(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0)
    return () => {
      clearTimeout(id)
      setMounted(false)
    }
  }, [])

  const cleanHtml = html.replace(/&nbsp;/g, " ")
  return (
    <div className="text-themeTextGray flex flex-col gap-y-3 wrap-break-word [&_blockqoute]:italic [&_h1]:text-2xl [&_h1]:lg:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_iframe]:aspect-video">
      {mounted && parse(cleanHtml)}
    </div>
  )
}
