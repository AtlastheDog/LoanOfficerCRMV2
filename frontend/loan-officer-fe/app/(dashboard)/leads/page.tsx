"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/contexts/auth-context"
import { Edit, Trash2, Search, Plus } from "lucide-react"
import LoadingSpinner from "@/components/shared/loading-spinner"

interface Lead {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  loan_type: string
  loan_purpose: string
  fico_score: number
  property_value: number
  loan_value: number
  minimum_rate_needed: number
  maximum_points_needed: number
  created_at: string
}

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Lead>("created_at")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await api.get("/api/leads")
        setLeads(response.data)
      } catch (error) {
        console.error("Error fetching leads:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await api.delete(`/api/leads/${id}`)
        setLeads(leads.filter((lead) => lead.id !== id))
      } catch (error) {
        console.error("Error deleting lead:", error)
      }
    }
  }

  const handleSort = (field: keyof Lead) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      lead.first_name.toLowerCase().includes(searchLower) ||
      lead.last_name.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      (lead.phone && lead.phone.includes(searchTerm))
    )
  })

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Leads</h1>
        <Link
          href="/leads/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Lead
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("last_name")}
                >
                  Name
                  {sortField === "last_name" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("email")}
                >
                  Email
                  {sortField === "email" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("loan_type")}
                >
                  Loan Type
                  {sortField === "loan_type" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("fico_score")}
                >
                  FICO Score
                  {sortField === "fico_score" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  Created
                  {sortField === "created_at" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedLeads.length > 0 ? (
                sortedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/leads/${lead.id}`} className="text-blue-600 hover:text-blue-900">
                        {lead.first_name} {lead.last_name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.loan_type || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{lead.fico_score || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/leads/${lead.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <Edit className="w-5 h-5 inline" />
                      </Link>
                      <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No leads found. {searchTerm ? "Try a different search term." : "Add a new lead to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
