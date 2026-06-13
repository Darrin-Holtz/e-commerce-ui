import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "VOLT — Bold Fashion",
  description: "Wear the voltage.",
};

const getAllowedRedirectOrigins = async () => {
  const requestHeaders = await headers();
  const forwardedProto = requestHeaders.get("x-forwarded-proto") ?? "http";
  const forwardedHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");

  if (!forwardedHost) {
    return undefined;
  }

  return [`${forwardedProto}://${forwardedHost}`];
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allowedRedirectOrigins = await getAllowedRedirectOrigins();

  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInForceRedirectUrl="/"
      signUpForceRedirectUrl="/"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      allowedRedirectOrigins={allowedRedirectOrigins}
    >
      <html lang="en">
        <body className={`${inter.variable} ${bebasNeue.variable} antialiased font-[family-name:var(--font-inter)]`}>
          <div className="mx-auto px-4 sm:px-6 xl:px-0 max-w-7xl">
            <Navbar />
            {children}
            <Footer />
          </div>
          <ToastContainer position="bottom-right" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}
