import type { Metadata } from "next";
import { Figtree, Bricolage_Grotesque } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { HeaderAuth } from "@/components/layout/header-auth";
import { Footer } from "@/components/layout/footer";
import { MobileNavAuth } from "@/components/layout/mobile-nav-auth";
import { Toaster } from "sonner";

const sans = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TumaHelper - Trusted Workers in Lusaka",
  description: "Find verified nannies and house cleaners in Lusaka, Zambia",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
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
      <head>
        <ThemeScript />
      </head>
      <body className={`${sans.variable} ${display.variable} font-sans`}>
        <ThemeProvider>
          {!isAdmin && <HeaderAuth />}
          <main className={isAdmin ? "" : "min-h-screen pb-16 md:pb-0"}>{children}</main>
          {!isAdmin && <Footer />}
          {!isAdmin && <MobileNavAuth />}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
