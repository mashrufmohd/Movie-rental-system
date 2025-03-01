// next/app/layout.tsx
"use client"; // Mark as a Client Component

import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"; // Adjust path if needed
import { Toaster } from "@/components/ui/toaster"; // Adjust path if needed
import { Navbar } from "@/components/navbar"; // Adjust path if needed
import { Footer } from "@/components/footer"; // Adjust path if needed
import { SessionProvider } from "next-auth/react"; // Import SessionProvider from next-auth/react


const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </ThemeProvider>
          </SessionProvider>
        </>
      </body>
    </html>
  );
}