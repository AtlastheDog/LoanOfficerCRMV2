import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthProvider"
import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Loan Officer CRM",
  description: "CRM system for loan officers to track leads and rate sheets",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 pt-16 md:pl-64">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
