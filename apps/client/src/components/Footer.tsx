import Link from "next/link"
import Image from "next/image"

const Footer = () => {
  return (
    <div className="mt-16 flex flex-col items-center md:flex-row md:items-start md:justify-between bg-gray-800 p-8 rounded-lg">
      <div className="w-full md:w-[225px] flex flex-col items-center md:items-start gap-4">
        <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="TrendLama Logo" width={36} height={36}/>
            <p className="hidden md:block text-md font-medium tracking-wider text-white">TRENDLAMA</p>            
        </Link>
        <p className="text-sm text-gray-400">E-commerce app & admin dashboard design with Next.js 15, Tailwind, TypeScript. Design a shopping app with React Next.js from scratch.</p>
      </div>
      <div className="flex flex-col items-center md:items-start gap-2 text-sm text-gray-400">
        <p className="text-sm text-amber-50">Links</p>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
      </div>
      <div className="flex flex-col items-center md:items-start gap-2 text-sm text-gray-400">
        <p className="text-sm text-amber-50">Links</p>
        <Link href="/">All Products</Link>
        <Link href="/">New Arrivals</Link>
        <Link href="/">Best Sellers</Link>
        <Link href="/privacy">Sale</Link>
      </div>
      <div className="flex flex-col items-center md:items-start gap-2 text-sm text-gray-400">
        <p className="text-sm text-amber-50">Links</p>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/affiliate">Affiliate Program</Link>
      </div>
    </div>
  )
}

export default Footer