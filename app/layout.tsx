/* 
keywords by @joncoded (aka @jonchius)
/app/layout.tsx
root layout for the whole app - header, looks, etc
*/

import type { Metadata } from "next"
import { Barlow_Semi_Condensed, Spectral } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/app/ThemeProvider"
import { Header } from "@/components/app/Header"
import { Footer } from "@/components/app/Footer"

const barlowSemiCondensed = Barlow_Semi_Condensed({
  variable: "--font-barlow-semi-condensed",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Keywords - understand words and writing",
  description: "Understand words and writing, as well as learn their roots!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${barlowSemiCondensed.variable} ${spectral.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main id="main-content" className="pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
