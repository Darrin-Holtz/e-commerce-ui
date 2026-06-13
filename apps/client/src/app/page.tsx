import ProductList from "@/components/ProductList"
import Link from "next/link"

const Homepage = async ({ searchParams }: { searchParams: Promise<{ category: string }> }) => {
  const category = (await searchParams).category;
  return (
    <div>
      {/* Hero */}
      <div className="relative flex flex-col lg:flex-row items-center min-h-[60vh] my-8 rounded-2xl overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800" />
        <div className="absolute top-8 right-8 w-64 h-64 rounded-full bg-volt opacity-10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-volt opacity-5 blur-3xl" />

        {/* Left — copy */}
        <div className="relative z-10 flex-1 px-10 py-16 flex flex-col gap-6">
          <p className="text-volt text-sm font-semibold tracking-[0.3em] uppercase">New Season Drop</p>
          <h1 className="font-[family-name:var(--font-bebas)] text-7xl md:text-9xl leading-none tracking-wide text-white">
            WEAR THE<br />
            <span className="text-volt">VOLTAGE</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md">
            Bold cuts. Electric colors. Fashion that refuses to be ignored.
          </p>
          <div className="flex gap-4 mt-2">
            <Link
              href="/products"
              className="bg-volt text-zinc-950 font-bold px-8 py-3 rounded-full text-sm tracking-widest uppercase hover:brightness-110 transition-all duration-200"
            >
              Shop Now
            </Link>
            <Link
              href="/products"
              className="border border-zinc-600 text-white font-semibold px-8 py-3 rounded-full text-sm tracking-widest uppercase hover:border-volt hover:text-volt transition-all duration-200"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Right — visual */}
        <div className="relative z-10 hidden lg:flex flex-col items-center justify-center w-[420px] py-16 pr-10 gap-6">
          <div className="absolute w-72 h-72 rounded-full bg-volt opacity-10 blur-2xl" />
          <p className="font-[family-name:var(--font-bebas)] text-[11rem] leading-none text-volt select-none relative z-10">
            25
          </p>
          <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase -mt-4">New Season</p>
          <div className="flex flex-col gap-3 w-full relative z-10">
            <span className="self-end bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full">
              ⚡ 500+ Styles
            </span>
            <span className="self-center bg-volt text-zinc-950 text-xs font-bold px-5 py-2.5 rounded-full">
              Free Shipping $75+
            </span>
            <span className="self-start bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold px-5 py-2.5 rounded-full">
              Easy Returns
            </span>
          </div>
        </div>
      </div>

      {/* Products */}
      <ProductList category={category} params="homepage" />
    </div>
  )
}

export default Homepage
