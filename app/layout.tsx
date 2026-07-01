import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "./context/ThemeContext"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Wild Haven - Luksusowy Glamping i Portale Noclegowe",
  description:
    "Platforma do rezerwacji luksusowych glampingów, namiotów safari, jurt i domków na drzewie. Odłącz się i połącz na nowo.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='pl'
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col bg-bg-custom text-fg-custom transition-colors duration-300'>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
