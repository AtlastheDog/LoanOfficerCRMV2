"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Search, Plus } from "lucide-react"
import { formatDate } from "@/lib/utils"
import LoadingSpinner from "@/components/shared/loading-spinner"
import type { Lead } from "@/types/lead"

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Button asChild>
          <Link href="/dashboard/leads/new">
            <Plus className="mr-2 h-4 w-4" />
            Add New Lead
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Leads</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort("last_name")}>
                  Name
                  {sortField === "last_name" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>
                  Email
                  {sortField === "email" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("loan_type")}>
                  Loan Type
                  {sortField === "loan_type" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("fico_score")}>
                  FICO Score
                  {sortField === "fico_score" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
                  Created
                  {sortField === "created_at" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.length > 0 ? (
                sortedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Link href={`/dashboard/leads/${lead.id}`} className="text-blue-600 hover:underline">
                        {lead.first_name} {lead.last_name}
                      </Link>
                    </TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.loan_type || "N/A"}</TableCell>
                    <TableCell>{lead.fico_score || "N/A"}</TableCell>
                    <TableCell>{formatDate(lead.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/dashboard/leads/${lead.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 mx-1"
                      >
                        <Edit className="h-4 w-4 inline" />
                        <span className="sr-only">Edit</span>
                      </Link>
                      <button onClick={() => handleDelete(lead.id)} className="text-red-600 hover:text-red-800 mx-1">
                        <Trash2 className="h-4 w-4 inline" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No leads found. {searchTerm ? "Try a different search term." : "Add a new lead to get started."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
