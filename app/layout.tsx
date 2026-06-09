import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { HeaderAuth } from "@/components/layout/header-auth";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/mobile-nav";
import { Toaster } from "sonner";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

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
      <body className={`${sans.variable} ${display.variable} font-sans`}>
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
