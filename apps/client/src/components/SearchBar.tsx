"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SearchBar = () => {
  const [value, setValue] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("search", value);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 focus-within:border-volt transition-colors duration-200">
      <Search className="w-4 h-4 text-zinc-500" />
      <input
        id="search"
        placeholder="Search..."
        className="text-sm outline-none bg-transparent text-white placeholder:text-zinc-600 w-32"
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch(value);
        }}
      />
    </div>
  );
};

export default SearchBar;
