"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShoppingBasket, Tag } from "lucide-react";

type Category = { id: number; name: string; slug: string };

const CategoryBar = ({ categories }: { categories: Category[] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedCategory = searchParams.get("category");

  useEffect(() => {
    if (!selectedCategory) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("category", "all");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, []);

  const handleChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", slug);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 bg-gray-100 p-2 rounded-lg mb-4 text-sm">
      <div
        onClick={() => handleChange("all")}
        className={`flex items-center justify-center gap-2 cursor-pointer px-2 py-1 rounded-md ${
          !selectedCategory || selectedCategory === "all"
            ? "bg-white"
            : "text-gray-500"
        }`}
      >
        <ShoppingBasket className="w-4 h-4" />
        All
      </div>
      {categories.map((category) => (
        <div
          key={category.id}
          onClick={() => handleChange(category.slug)}
          className={`flex items-center justify-center gap-2 cursor-pointer px-2 py-1 rounded-md ${
            selectedCategory === category.slug ? "bg-white" : "text-gray-500"
          }`}
        >
          <Tag className="w-4 h-4" />
          {category.name}
        </div>
      ))}
    </div>
  );
};

export default CategoryBar;
