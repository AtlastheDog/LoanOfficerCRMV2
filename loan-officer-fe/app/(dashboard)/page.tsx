"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/contexts/auth-context"
import { Users, Upload, BarChart } from "lucide-react"
import LoadingSpinner from "@/components/shared/loading-spinner"

interface DashboardStats {
  totalLeads: number
  leadsWithScenarios: number
  totalRateSheets: number
  matchedLeads: number
}

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
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Leads</p>
              <p className="text-2xl font-bold">{stats.totalLeads}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Leads with Scenarios</p>
              <p className="text-2xl font-bold">{stats.leadsWithScenarios}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Rate Sheets</p>
              <p className="text-2xl font-bold">{stats.totalRateSheets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <BarChart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Matched Leads</p>
              <p className="text-2xl font-bold">{stats.matchedLeads}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/leads/new"
              className="flex items-center justify-center p-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              <Users className="w-5 h-5 mr-2" />
              Add New Lead
            </Link>
            <Link
              href="/rates/upload"
              className="flex items-center justify-center p-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Rate Sheet
            </Link>
            <Link
              href="/leads/analyze"
              className="flex items-center justify-center p-4 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100"
            >
              <BarChart className="w-5 h-5 mr-2" />
              Analyze Leads
            </Link>
            <Link
              href="/leads"
              className="flex items-center justify-center p-4 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
            >
              <Users className="w-5 h-5 mr-2" />
              View All Leads
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">API Connection</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">OCR Service</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Lead Matching</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Ready</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Rate Sheet Update</span>
              <span className="text-gray-600">Today at 9:30 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
