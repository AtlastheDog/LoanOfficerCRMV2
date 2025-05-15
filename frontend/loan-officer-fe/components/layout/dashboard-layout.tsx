"use client"

import { useAuth } from "@/contexts/auth-context"
import Navbar from "@/components/layout/navbar"
import Sidebar from "@/components/layout/sidebar"
import { useRouter } from "next/router"
import LoadingSpinner from "@/components/shared/loading-spinner"
import { useEffect, type ReactNode } from "react"
import Head from "next/head"

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
}

export default function DashboardLayout({ children, title = "Dashboard" }: DashboardLayoutProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?returnTo=${encodeURIComponent(router.asPath)}`)
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return null // Will be redirected by useEffect
  }

  return (
    <>
      <Head>
        <title>{title} | Loan Officer CRM</title>
      </Head>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar user={user} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 mt-14">{children}</main>
        </div>
      </div>
    </>
  )
}
