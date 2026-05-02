import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { userId } = await auth();
  console.log("[sign-in page] userId =", userId);
  if (userId) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <SignIn forceRedirectUrl="/" />
    </div>
  );
}