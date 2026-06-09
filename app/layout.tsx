import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { HeaderAuth } from "@/components/layout/header-auth";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/mobile-nav";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TumaHelper - Trusted Workers in Lusaka",
  description: "Find verified nannies and house cleaners in Lusaka, Zambia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = headers().get("x-pathname") || "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          {!isAdmin && <HeaderAuth />}
          <main className={isAdmin ? "" : "min-h-screen pb-16 md:pb-0"}>{children}</main>
          {!isAdmin && <Footer />}
          {!isAdmin && <MobileNav />}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
