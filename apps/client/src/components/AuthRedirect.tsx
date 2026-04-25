"use client"

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type AuthRedirectProps = {
  redirectTo: string
}

const AuthRedirect = ({ redirectTo }: AuthRedirectProps) => {
  const { userId, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded || !userId) return

    router.replace(redirectTo)
  }, [isLoaded, redirectTo, router, userId])

  return null
}

export default AuthRedirect