"use client";

import useCartStore from "@/stores/cartStore";
import { ProductType } from "@e-commerce-ui/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ product }: { product: ProductType }) => {
  const [productTypes, setProductTypes] = useState({
    size: product.sizes[0],
    color: product.colors[0],
  });

  const { addToCart } = useCartStore();

  const handleProductType = ({ type, value }: { type: "size" | "color"; value: string }) => {
    setProductTypes((prev) => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
      selectedSize: productTypes.size,
      selectedColor: productTypes.color,
    });
    toast.success("Added to cart");
  };

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden group flex flex-col">
      <Link href={`/products/${product.id}`} className="relative aspect-[2/3] block overflow-hidden">
        <Image
          src={(product.images as Record<string, string>)[productTypes.color]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <h2 className="font-semibold text-white text-sm">{product.name}</h2>
          <p className="text-zinc-500 text-xs mt-1 line-clamp-2">{product.shortDescription}</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Size</span>
            <select
              name="size"
              className="bg-zinc-800 border border-zinc-700 text-white rounded-md px-2 py-1 text-xs focus:outline-none focus:border-volt"
              onChange={(e) => handleProductType({ type: "size", value: e.target.value })}
            >
              {product.sizes.map((size: string) => (
                <option key={size} value={size}>{size.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 uppercase tracking-wider text-[10px]">Color</span>
            <div className="flex items-center gap-2 mt-1">
              {product.colors.map((color: string) => (
                <button
                  key={color}
                  onClick={() => handleProductType({ type: "color", value: color })}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    productTypes.color === color ? "border-volt scale-110" : "border-zinc-600"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800">
          <p className="font-bold text-white">${Number(product.price).toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            className="bg-volt text-zinc-950 font-bold text-xs px-3 py-2 rounded-lg flex items-center gap-2 hover:brightness-110 transition-all duration-200 cursor-pointer"
          >
            <ShoppingCart className="w-3 h-3" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
