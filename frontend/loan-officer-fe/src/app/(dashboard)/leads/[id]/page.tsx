"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, User, Phone, Mail, Home, DollarSign, Percent, CreditCard } from "lucide-react"
import { formatCurrency, formatDate, formatDateTime, formatPercentage } from "@/lib/utils"
import LoadingSpinner from "@/components/shared/loading-spinner"
import type { Lead } from "@/types/lead"

interface Scenario {
  id: number
  actual_interest_rate: number
  points: number
  fico_score_group: string
  loan_type_group: string
  property_value_group: string
  loan_value_group: string
  loan_purpose_group: string
  state: string
  occupancy: string
  created_at: string
}

export default function LeadDetail() {
  const params = useParams()
  const id = params?.id as string
  const [lead, setLead] = useState<Lead | null>(null)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await api.get(`/api/leads/${id}`)
        setLead(response.data.lead)
        setScenarios(response.data.scenarios || [])
      } catch (error) {
        console.error("Error fetching lead:", error)
        setError("Failed to load lead details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchLead()
    }
  }, [id])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !lead) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || "Lead not found"}</span>
        </div>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/leads">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leads
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button asChild variant="outline" size="sm" className="mr-2">
            <Link href="/dashboard/leads">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">
            {lead.first_name} {lead.last_name}
          </h1>
        </div>
        <Button asChild>
          <Link href={`/dashboard/leads/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Lead
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lead Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal">
                <TabsList className="mb-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="loan">Loan Details</TabsTrigger>
                </TabsList>
                <TabsContent value="personal">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                        <p className="mt-1 text-sm">
                          {lead.first_name} {lead.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                        <p className="mt-1 text-sm">{lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Phone</p>
                        <p className="mt-1 text-sm">{lead.phone || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CreditCard className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">FICO Score</p>
                        <p className="mt-1 text-sm">{lead.fico_score || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="loan">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <Home className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Loan Type</p>
                        <p className="mt-1 text-sm">{lead.loan_type || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Home className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Loan Purpose</p>
                        <p className="mt-1 text-sm">{lead.loan_purpose || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Home className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Property Type</p>
                        <p className="mt-1 text-sm">{lead.property_type || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Home className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">State</p>
                        <p className="mt-1 text-sm">{lead.state || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Property Value</p>
                        <p className="mt-1 text-sm">
                          {lead.property_value ? formatCurrency(lead.property_value) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <DollarSign className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Loan Value</p>
                        <p className="mt-1 text-sm">{lead.loan_value ? formatCurrency(lead.loan_value) : "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Percent className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Minimum Rate Needed</p>
                        <p className="mt-1 text-sm">
                          {lead.minimum_rate_needed ? formatPercentage(lead.minimum_rate_needed) : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Percent className="w-5 h-5 text-muted-foreground mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Maximum Points Needed</p>
                        <p className="mt-1 text-sm">
                          {lead.maximum_points_needed !== null ? lead.maximum_points_needed : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              {scenarios.length > 0 ? (
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">Scenario #{scenario.id}</h4>
                        <span className="text-xs text-muted-foreground">{formatDate(scenario.created_at)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Rate:</p>
                          <p className="font-medium">{formatPercentage(scenario.actual_interest_rate)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Points:</p>
                          <p className="font-medium">{scenario.points}</p>
                        </div>
                        {scenario.fico_score_group && (
                          <div>
                            <p className="text-muted-foreground">FICO Group:</p>
                            <p className="font-medium">{scenario.fico_score_group}</p>
                          </div>
                        )}
                        {scenario.loan_type_group && (
                          <div>
                            <p className="text-muted-foreground">Loan Type:</p>
                            <p className="font-medium">{scenario.loan_type_group}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No scenarios available</p>
                  <p className="text-xs text-muted-foreground mt-1">Upload a rate sheet to generate scenarios</p>
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/dashboard/rates/upload">Upload Rate Sheet</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">Lead created</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(lead.created_at)}</p>
                  </div>
                </div>
                {lead.created_at !== lead.updated_at && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Edit className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">Lead updated</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(lead.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
