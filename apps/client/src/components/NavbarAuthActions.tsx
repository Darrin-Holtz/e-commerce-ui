"use client"

import { Show, SignInButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"
import ProfileButton from "./ProfileButton"

const AUTH_ROUTES = new Set(["/sign-in", "/sign-up"])

const NavbarAuthActions = () => {
  const pathname = usePathname()

  if (AUTH_ROUTES.has(pathname)) {
    return null
  }

  return (
    <>
      <Show when="signed-out">
        <SignInButton forceRedirectUrl="/" fallbackRedirectUrl="/">
          <button className="bg-volt text-zinc-950 font-bold text-xs px-5 py-2 rounded-full uppercase tracking-widest hover:brightness-110 transition-all duration-200 cursor-pointer">
            Sign In
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <ProfileButton />
      </Show>
    </>
  )
}

export default NavbarAuthActions
