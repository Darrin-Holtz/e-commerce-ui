"use client";

import { CategoryType } from "@e-commerce-ui/types";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteCategory } from "./actions";
import { toast } from "react-toastify";

function DeleteCategoryButton({ id }: { id: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this category?")) return;
    setIsDeleting(true);
    try {
      await deleteCategory(id);
      toast.success("Category deleted.");
    } catch {
      toast.error("Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

export const columns: ColumnDef<CategoryType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    id: "actions",
    header: "Delete",
    cell: ({ row }) => <DeleteCategoryButton id={row.original.id} />,
  },
];
