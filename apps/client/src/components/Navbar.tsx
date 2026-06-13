import Link from "next/link"
import SearchBar from "./SearchBar"
import ShoppingCartIcon from "./ShoppingCartIcon"
import NavbarAuthActions from "./NavbarAuthActions"

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between py-5 border-b border-zinc-800">
      <Link href="/" className="font-[family-name:var(--font-bebas)] text-3xl tracking-widest text-volt leading-none">
        VOLT
      </Link>
      <div className="flex items-center gap-6">
        <SearchBar />
        <Link href="/cart" title="Cart">
          <ShoppingCartIcon />
        </Link>
        <NavbarAuthActions />
      </div>
    </nav>
  )
}

export default Navbar
