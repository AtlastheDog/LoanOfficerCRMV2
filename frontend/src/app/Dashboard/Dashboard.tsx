"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import api from "@/services/api"
import { Users, Upload, BarChart } from "lucide-react"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

interface DashboardStats {
  totalLeads: number
  leadsWithScenarios: number
  totalRateSheets: number
  matchedLeads: number
}

const Dashboard = () => {
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
        const response = await api.get("/dashboard")
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard label="Total Leads" icon={<Users className="w-6 h-6" />} count={stats.totalLeads} color="blue" />
        <DashboardCard label="Leads with Scenarios" icon={<Users className="w-6 h-6" />} count={stats.leadsWithScenarios} color="green" />
        <DashboardCard label="Rate Sheets" icon={<Upload className="w-6 h-6" />} count={stats.totalRateSheets} color="purple" />
        <DashboardCard label="Matched Leads" icon={<BarChart className="w-6 h-6" />} count={stats.matchedLeads} color="yellow" />
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
            <StatusLine label="API Connection" status="Connected" />
            <StatusLine label="OCR Service" status="Active" />
            <StatusLine label="Lead Matching" status="Ready" />
            <StatusLine label="Last Rate Sheet Update" status="Today at 9:30 AM" neutral />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

// Sub-components for clarity

const DashboardCard = ({
  label,
  count,
  icon,
  color
}: {
  label: string
  count: number
  icon: React.ReactNode
  color: string
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full bg-${color}-100 text-${color}-500 mr-4`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </div>
  </div>
)

const StatusLine = ({ label, status, neutral = false }: { label: string; status: string; neutral?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}</span>
    <span
      className={`px-2 py-1 ${
        neutral ? "text-gray-600" : "bg-green-100 text-green-800"
      } rounded-full text-xs`}
    >
      {status}
    </span>
  </div>
)
