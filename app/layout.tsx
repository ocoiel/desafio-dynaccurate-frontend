import "@/styles/globals.css"
import { Metadata } from "next"
import NextTopLoader from "nextjs-toploader"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import TanstackProvider from "@/components/providers/tanstack-provider"
import { ToastProvider } from "@/components/providers/toast-provider"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <TanstackProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="relative flex min-h-screen flex-col">
                <NextTopLoader
                  showSpinner={false}
                  color="#fff"
                  shadow="0 0 10px #fff, 0 0 12px #fff"
                />
                <SiteHeader />
                <ToastProvider>
                  <div className="flex-1">{children}</div>
                </ToastProvider>
              </div>
              <TailwindIndicator />
            </ThemeProvider>
          </TanstackProvider>
        </body>
      </html>
    </>
  )
}
