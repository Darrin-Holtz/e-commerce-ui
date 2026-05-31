import { CategoryType } from "@e-commerce-ui/types";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Sheet, SheetTrigger } from "@e-commerce-ui/ui";
import AddCategory from "@/components/AddCategory";
import { Plus } from "lucide-react";

const getData = async (): Promise<CategoryType[]> => {
  try {
    const res = await fetch(
      `${process.env.PRODUCT_SERVICE_URL}/categories`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

const CategoriesPage = async () => {
  const data = await getData();
  return (
    <div>
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md flex items-center justify-between">
        <h1 className="font-semibold">All Categories</h1>
        <Sheet>
          <SheetTrigger className="flex items-center gap-1 text-sm font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md">
            <Plus className="w-4 h-4" />
            Add Category
          </SheetTrigger>
          <AddCategory />
        </Sheet>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default CategoriesPage;
