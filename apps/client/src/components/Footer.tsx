import Link from "next/link"

const Footer = () => {
  return (
    <footer className="mt-24 border-t border-zinc-800 pt-16 pb-10">
      <div className="flex flex-col md:flex-row gap-12 md:gap-0 md:justify-between">
        <div className="flex flex-col gap-4 max-w-xs">
          <span className="font-[family-name:var(--font-bebas)] text-4xl tracking-widest text-volt leading-none">
            VOLT
          </span>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Bold fashion for bold people. New drops every season — always electric, never ordinary.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-volt font-semibold uppercase tracking-widest text-xs">Shop</p>
          <Link href="/products" className="text-zinc-400 hover:text-volt transition-colors">All Products</Link>
          <Link href="/products" className="text-zinc-400 hover:text-volt transition-colors">New Arrivals</Link>
          <Link href="/products" className="text-zinc-400 hover:text-volt transition-colors">Best Sellers</Link>
          <Link href="/products" className="text-zinc-400 hover:text-volt transition-colors">Sale</Link>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-volt font-semibold uppercase tracking-widest text-xs">Company</p>
          <Link href="/" className="text-zinc-400 hover:text-volt transition-colors">About</Link>
          <Link href="/" className="text-zinc-400 hover:text-volt transition-colors">Careers</Link>
          <Link href="/" className="text-zinc-400 hover:text-volt transition-colors">Blog</Link>
          <Link href="/" className="text-zinc-400 hover:text-volt transition-colors">Affiliate Program</Link>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <p className="text-volt font-semibold uppercase tracking-widest text-xs">Support</p>
          <Link href="/" className="text-zinc-400 hover:text-volt transition-colors">Contact</Link>
          <Link href="/" className="text-zinc-400 hover:text-volt transition-colors">FAQ</Link>
          <Link href="/" className="text-zinc-400 hover:text-volt transition-colors">Privacy Policy</Link>
          <Link href="/" className="text-zinc-400 hover:text-volt transition-colors">Terms of Service</Link>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-zinc-600 text-xs">© {new Date().getFullYear()} VOLT. All rights reserved.</p>
        <p className="text-zinc-600 text-xs">Wear the voltage.</p>
      </div>
    </footer>
  )
}

export default Footer
