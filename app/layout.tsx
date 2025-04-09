import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from '@vercel/analytics/react';
import { cn } from "@/lib/utils"
import type { Metadata } from "next";
import PlotlyPreloader from "@/app/components/PlotlyPreloader";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true
})

export const metadata: Metadata = {
  title: "Bitsway - Gestion de Trésorerie Bitcoin",
  description: "Accompagnement des entreprises dans l'intégration de Bitcoin dans leur trésorerie",
  generator: 'v0.dev',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <PlotlyPreloader />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}