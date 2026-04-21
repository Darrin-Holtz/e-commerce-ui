"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"

const ShoppingCartIcon = () => {
  return (
    <Link href="/cart" title="Cart" className="relative">
        <ShoppingCart className="w-4 h-4 text-gray-600"/>
        <span className="absolute -top-3 -right-2 bg-amber-400 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">2</span>
    </Link>
  )
}

export default ShoppingCartIcon