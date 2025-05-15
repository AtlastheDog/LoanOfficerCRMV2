"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ThumbsUp, ThumbsDown, User, CreditCard, Percent } from "lucide-react"
import { api } from "@/contexts/auth-context"
import LoadingSpinner from "@/components/shared/loading-spinner"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { withAuth } from "@/utils/auth"
import type { GetServerSideProps } from "next"

interface MatchedLead {
  id: number
  first_name: string
  last_name: string
  email: string
  fico_score: number
  loan_purpose: string
  minimum_rate_needed: number
  maximum_points_needed: number
  feedback?: {
    satisfied_rate: boolean
    satisfied_points: boolean
  }
}

export default function AnalyzeLeads() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [matchedLeads, setMatchedLeads] = useState<MatchedLead[]>([])
  const [feedbackStatus, setFeedbackStatus] = useState<
    Record<number, { rate: boolean | null; points: boolean | null }>
  >({})

  useEffect(() => {
    const fetchMatchedLeads = async () => {
      try {
        const response = await api.get("/leads/analyze")
        setMatchedLeads(response.data || [])

        // Initialize feedback status
        const initialFeedbackStatus: Record<number, { rate: boolean | null; points: boolean | null }> = {}
        response.data.forEach((lead: MatchedLead) => {
          initialFeedbackStatus[lead.id] = {
            rate: lead.feedback?.satisfied_rate ?? null,
            points: lead.feedback?.satisfied_points ?? null,
          }
        })
        setFeedbackStatus(initialFeedbackStatus)
      } catch (err) {
        console.error("Error fetching matched leads:", err)
        setError("Failed to load matched leads. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchMatchedLeads()
  }, [])

  const handleFeedback = async (leadId: number, type: "rate" | "points", value: boolean) => {
    // Update local state first for immediate feedback
    setFeedbackStatus((prev) => ({
      ...prev,
      [leadId]: {
        ...prev[leadId],
        [type]: value,
      },
    }))

    try {
      await api.post(`/leads/${leadId}/feedbacks`, {
        feedback: {
          satisfied_rate: type === "rate" ? value : (feedbackStatus[leadId]?.rate ?? null),
          satisfied_points: type === "points" ? value : (feedbackStatus[leadId]?.points ?? null),
        },
      })
    } catch (err) {
      console.error("Error submitting feedback:", err)
      // Revert the local state if the API call fails
      setFeedbackStatus((prev) => ({
        ...prev,
        [leadId]: {
          ...prev[leadId],
          [type]: null,
        },
      }))
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <DashboardLayout title="Analyze Leads">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center">
          <Link href="/" className="mr-4 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold">Analyze Leads</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Matched Leads</h3>
            <p className="mt-1 text-sm text-gray-500">
              These leads match the criteria from your uploaded rate sheet. Provide feedback on the matches.
            </p>
          </div>

          {matchedLeads.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {matchedLeads.map((lead) => (
                <div key={lead.id} className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          <Link href={`/leads/${lead.id}`} className="hover:text-blue-600">
                            {lead.first_name} {lead.last_name}
                          </Link>
                        </h4>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 md:grid-cols-4">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">FICO Score</p>
                        <p className="text-sm text-gray-900">{lead.fico_score || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Percent className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Min Rate Needed</p>
                        <p className="text-sm text-gray-900">
                          {lead.minimum_rate_needed ? `${lead.minimum_rate_needed}%` : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Percent className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Max Points</p>
                        <p className="text-sm text-gray-900">
                          {lead.maximum_points_needed !== null ? lead.maximum_points_needed : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Loan Purpose</p>
                        <p className="text-sm text-gray-900">{lead.loan_purpose || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                      <div className="mb-4 sm:mb-0">
                        <h5 className="text-sm font-medium text-gray-700">Provide Feedback</h5>
                      </div>
                      <div className="flex space-x-6">
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Rate Match</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleFeedback(lead.id, "rate", true)}
                              className={`p-2 rounded-full ${
                                feedbackStatus[lead.id]?.rate === true
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500"
                              }`}
                              aria-label="Rate match is good"
                            >
                              <ThumbsUp className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(lead.id, "rate", false)}
                              className={`p-2 rounded-full ${
                                feedbackStatus[lead.id]?.rate === false
                                  ? "bg-red-100 text-red-600"
                                  : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
                              }`}
                              aria-label="Rate match is not good"
                            >
                              <ThumbsDown className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Points Match</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleFeedback(lead.id, "points", true)}
                              className={`p-2 rounded-full ${
                                feedbackStatus[lead.id]?.points === true
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-500"
                              }`}
                              aria-label="Points match is good"
                            >
                              <ThumbsUp className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(lead.id, "points", false)}
                              className={`p-2 rounded-full ${
                                feedbackStatus[lead.id]?.points === false
                                  ? "bg-red-100 text-red-600"
                                  : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
                              }`}
                              aria-label="Points match is not good"
                            >
                              <ThumbsDown className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No leads match the current rate sheet criteria.</p>
              <div className="mt-4 flex justify-center space-x-4">
                <Link
                  href="/leads/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Add New Lead
                </Link>
                <Link
                  href="/rates/upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                  Upload Different Rate Sheet
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export const getServerSideProps: GetServerSideProps = withAuth()
