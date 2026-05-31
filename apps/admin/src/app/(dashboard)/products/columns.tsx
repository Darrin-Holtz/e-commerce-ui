"use client";

import { Button } from "@e-commerce-ui/ui";
import { Checkbox } from "@e-commerce-ui/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@e-commerce-ui/ui";
import { Sheet } from "@e-commerce-ui/ui";
import { ProductType } from "@e-commerce-ui/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import EditProduct from "@/components/EditProduct";

function ProductActions({ product }: { product: ProductType }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(product.id.toString())}
          >
            Copy product ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Edit product
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/products/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View product
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <EditProduct product={product} onSuccess={() => setEditOpen(false)} />
      </Sheet>
    </>
  );
}

export const columns: ColumnDef<ProductType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <div className="w-9 h-9 relative">
          <Image
            src={
              (product.images as Record<string, string>)?.[
                product.colors[0] || ""
              ] || ""
            }
            alt={product.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => `$${Number(row.getValue("price")).toFixed(2)}`,
  },
  {
    accessorKey: "shortDescription",
    header: "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductActions product={row.original} />,
  },
];
