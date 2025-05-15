"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Edit, ArrowLeft, User, Phone, Mail, Home, DollarSign, Percent, CreditCard, Upload } from "lucide-react"
import LoadingSpinner from "../LoadingSpinner"
import { fetchLead } from "@/lib/api"

interface Lead {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  loan_type: string
  loan_purpose: string
  property_type: string
  property_value: number
  loan_value: number
  fico_score: number
  state: string
  occupancy: string
  minimum_rate_needed: number
  maximum_points_needed: number
  created_at: string
  updated_at: string
}

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

export default function LeadDetail({ id }: { id: string }) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const getLead = async () => {
      try {
        const data = await fetchLead(id)
        setLead(data.lead)
        setScenarios(data.scenarios || [])
      } catch (error) {
        console.error("Error fetching lead:", error)
        setError("Failed to load lead details")
      } finally {
        setLoading(false)
      }
    }

    getLead()
  }, [id])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !lead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || "Lead not found"}</span>
        </div>
        <div className="mt-4">
          <button
            onClick={() => router.push("/leads")}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Leads
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/leads" className="mr-4 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold">
            {lead.first_name} {lead.last_name}
          </h1>
        </div>
        <Link
          href={`/leads/${id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Lead
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Lead Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {lead.first_name} {lead.last_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="mt-1 text-sm text-gray-900">{lead.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">FICO Score</p>
                    <p className="mt-1 text-sm text-gray-900">{lead.fico_score || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-base font-medium text-gray-900 mb-4">Loan Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <Home className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Loan Type</p>
                      <p className="mt-1 text-sm text-gray-900">{lead.loan_type || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Home className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Loan Purpose</p>
                      <p className="mt-1 text-sm text-gray-900">{lead.loan_purpose || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Home className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Property Type</p>
                      <p className="mt-1 text-sm text-gray-900">{lead.property_type || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Home className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">State</p>
                      <p className="mt-1 text-sm text-gray-900">{lead.state || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Property Value</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {lead.property_value ? `$${lead.property_value.toLocaleString()}` : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Loan Value</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {lead.loan_value ? `$${lead.loan_value.toLocaleString()}` : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Percent className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Minimum Rate Needed</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {lead.minimum_rate_needed ? `${lead.minimum_rate_needed}%` : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Percent className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Maximum Points Needed</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {lead.maximum_points_needed !== null ? lead.maximum_points_needed : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Scenarios</h3>
            </div>
            <div className="p-6">
              {scenarios.length > 0 ? (
                <div className="space-y-4">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">Scenario #{scenario.id}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(scenario.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Rate:</p>
                          <p className="font-medium">{scenario.actual_interest_rate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Points:</p>
                          <p className="font-medium">{scenario.points}</p>
                        </div>
                        {scenario.fico_score_group && (
                          <div>
                            <p className="text-gray-500">FICO Group:</p>
                            <p className="font-medium">{scenario.fico_score_group}</p>
                          </div>
                        )}
                        {scenario.loan_type_group && (
                          <div>
                            <p className="text-gray-500">Loan Type:</p>
                            <p className="font-medium">{scenario.loan_type_group}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No scenarios available</p>
                  <p className="text-gray-500 text-xs mt-1">Upload a rate sheet to generate scenarios for this lead</p>
                  <Link
                    href="/rates/upload"
                    className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Rate Sheet
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-900">Lead created</p>
                    <p className="text-xs text-gray-500">{new Date(lead.created_at).toLocaleString()}</p>
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
                      <p className="text-sm text-gray-900">Lead updated</p>
                      <p className="text-xs text-gray-500">{new Date(lead.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
