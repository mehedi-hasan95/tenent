import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

interface Props {
  title: string
  total: number
  icon?: React.ElementType
}
export const CountCard = ({ title, total, icon: Icon }: Props) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-1 text-sm font-medium text-muted-foreground">
          <span className="flex items-center gap-1">
            {Icon && <Icon size="20" />}
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xl font-bold">
        <div className="flex items-center justify-between text-2xl font-bold">
          {total}
        </div>
      </CardContent>
    </Card>
  )
}
