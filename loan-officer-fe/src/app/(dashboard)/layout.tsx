import type React from "react"
import Navbar from "@/components/layout/navbar"
import Sidebar from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 lg:ml-64 pt-14">
          <div className="container p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
