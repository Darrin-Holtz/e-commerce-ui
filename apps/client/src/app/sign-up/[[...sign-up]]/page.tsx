import { SignUp } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AuthRedirect from '@/components/AuthRedirect'
import { getSafeRedirectPath } from '../../sign-in/[[...sign-in]]/page'

type SignUpPageProps = {
  searchParams: Promise<{ redirect_url?: string }>
}

export default async function Page({ searchParams }: SignUpPageProps) {
  const { redirect_url } = await searchParams
  const redirectPath = getSafeRedirectPath(redirect_url)
  const { userId } = await auth()

  if (userId) {
    redirect(redirectPath)
  }

  return (
    <div className="flex items-center justify-center mt-16">
      <AuthRedirect redirectTo={redirectPath} />
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        forceRedirectUrl={redirectPath}
        fallbackRedirectUrl={redirectPath}
      />
    </div>
  )
}