import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AuthRedirect from '@/components/AuthRedirect'
import { getSafeRedirectPath } from '@/lib/get-safe-redirect-path'

type SignInPageProps = {
  searchParams: Promise<{ redirect_url?: string }>
}

export default async function Page({ searchParams }: SignInPageProps) {
  const { redirect_url } = await searchParams
  const redirectPath = getSafeRedirectPath(redirect_url)
  const { userId } = await auth()

  if (userId) {
    redirect(redirectPath)
  }

  return (
    <div className="flex items-center justify-center mt-16">
      <AuthRedirect redirectTo={redirectPath} />
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        forceRedirectUrl={redirectPath}
        fallbackRedirectUrl={redirectPath}
      />
    </div>
  )
}