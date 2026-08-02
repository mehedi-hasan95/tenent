import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

interface Props {
  specifications: { key: string; value: string }[]
}

export const SpecificationTable = ({ specifications }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Specification</TableHead>
          <TableHead>Details</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {specifications.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.key}</TableCell>
            <TableCell>{item.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
