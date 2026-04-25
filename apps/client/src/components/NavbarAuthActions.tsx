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
        <SignInButton forceRedirectUrl="/" fallbackRedirectUrl="/" />
      </Show>
      <Show when="signed-in">
        <ProfileButton />
      </Show>
    </>
  )
}

export default NavbarAuthActions