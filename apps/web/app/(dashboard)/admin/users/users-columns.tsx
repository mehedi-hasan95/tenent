"use client"

import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header"
import { ColumnDef } from "@tanstack/table-core"
import { Badge } from "@workspace/ui/components/badge"
import { getUserType } from "@workspace/validators/types/auth.types"
import { formatDistanceToNow } from "date-fns"
import { Check, X } from "lucide-react"

export const UsersColumns = (): ColumnDef<getUserType>[] => [
  {
    accessorKey: "name",
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <p>{row.original.name}</p>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    accessorFn: (row) => row.phone,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      return <div className="space-y-1">{row.original.phone}</div>
    },
  },
  {
    accessorKey: "email",
    accessorFn: (row) => row.email,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return <div className="space-y-1">{row.original.email}</div>
    },
  },
  {
    accessorKey: "role",
    accessorFn: (row) => row.role,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          {row.original.role === "ADMIN" ? (
            <Badge variant={"primary"}>Admin</Badge>
          ) : row.original.role === "SELLER" ? (
            <Badge variant={"secondary"}>Seller</Badge>
          ) : (
            <Badge>User</Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "emailVerified",
    accessorFn: (row) => row.emailVerified,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verified" />
    ),
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          {row.original.emailVerified ? (
            <Badge variant={"primary"}>
              <Check />
              Verified
            </Badge>
          ) : (
            <Badge variant={"destructive"}>
              <X />
              Unverified
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "stripeVerified",
    accessorFn: (row) => row.stripeVerified,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Stripe" />
    ),
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          {row.original.emailVerified ? (
            <Badge variant={"primary"}>
              <Check />
              Connect
            </Badge>
          ) : (
            <Badge variant={"destructive"}>
              <X />
              Not
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "createdAt",
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Opening" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt

      return (
        <span>
          {date
            ? formatDistanceToNow(new Date(date), { addSuffix: true })
            : "-"}
        </span>
      )
    },
  },
]
