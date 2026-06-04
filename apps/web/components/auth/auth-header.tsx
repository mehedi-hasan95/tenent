import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { JSX } from "react"

interface Props {
  className?: string
  title: string
  desc?: string
  children: React.ReactNode
  footer?: JSX.Element
}
export const AuthHeader = ({
  className,
  title,
  desc,
  children,
  footer,
}: Props) => {
  return (
    <Card className={cn("w-full max-w-lg", className)}>
      <CardHeader>
        <CardTitle className="md:text-xl lg:text-2xl">{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter className="flex flex-col">{footer}</CardFooter>}
    </Card>
  )
}
