"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => handleChange("all")}
        className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
          !selectedCategory || selectedCategory === "all"
            ? "bg-volt text-zinc-950"
            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
        }`}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleChange(category.slug)}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer ${
            selectedCategory === category.slug
              ? "bg-volt text-zinc-950"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
