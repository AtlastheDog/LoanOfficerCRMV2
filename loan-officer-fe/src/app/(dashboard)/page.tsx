"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { BarChart3, Upload, Users } from "lucide-react"
import LoadingSpinner from "@/components/shared/loading-spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { DashboardStats } from "@/types/dashboard"

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    leadsWithScenarios: 0,
    totalRateSheets: 0,
    matchedLeads: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/api/dashboard")
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Leads with Scenarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.leadsWithScenarios}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rate Sheets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Upload className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.totalRateSheets}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Matched Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.matchedLeads}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/dashboard/leads/new">
                  <Users className="mr-2 h-4 w-4" />
                  Add New Lead
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/dashboard/rates/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Rate Sheet
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/dashboard/leads/analyze">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyze Leads
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/dashboard/leads">
                  <Users className="mr-2 h-4 w-4" />
                  View All Leads
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>API Connection</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Connected</span>
              </div>
              <div className="flex justify-between items-center">
                <span>OCR Service</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Lead Matching</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Ready</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Rate Sheet Update</span>
                <span>Today at 9:30 AM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
