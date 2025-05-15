"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import LoadingSpinner from "../shared/LoadingSpinner"
import { fetchLead, updateLead } from "@/lib/api"

export default function EditLead({ id }: { id: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    loan_type: "",
    loan_purpose: "",
    property_type: "",
    property_value: "",
    loan_value: "",
    fico_score: "",
    state: "",
    occupancy: "",
    minimum_rate_needed: "",
    maximum_points_needed: "",
  })

  const loanTypes = ["Conventional", "FHA", "VA/IRRL", "USDA"]
  const loanPurposes = ["Purchase", "No cash-out refinance", "Cash out refinance"]
  const propertyTypes = ["SFR", "Condo", "MultiUnit", "PUD"]
  const occupancyTypes = ["Primary", "Secondary", "Investment"]
  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ]

  useEffect(() => {
    const getLead = async () => {
      try {
        const data = await fetchLead(id)
        const lead = data.lead

        // Format the data for the form
        setFormData({
          first_name: lead.first_name || "",
          last_name: lead.last_name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          loan_type: lead.loan_type || "",
          loan_purpose: lead.loan_purpose || "",
          property_type: lead.property_type || "",
          property_value: lead.property_value?.toString() || "",
          loan_value: lead.loan_value?.toString() || "",
          fico_score: lead.fico_score?.toString() || "",
          state: lead.state || "",
          occupancy: lead.occupancy || "",
          minimum_rate_needed: lead.minimum_rate_needed?.toString() || "",
          maximum_points_needed: lead.maximum_points_needed?.toString() || "",
        })
      } catch (error) {
        console.error("Error fetching lead:", error)
        setError("Failed to load lead data")
      } finally {
        setIsLoading(false)
      }
    }

    getLead()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Convert numeric fields
      const numericFields = [
        "property_value",
        "loan_value",
        "fico_score",
        "minimum_rate_needed",
        "maximum_points_needed",
      ]
      const processedData = { ...formData }

      numericFields.forEach((field) => {
        if (processedData[field as keyof typeof processedData]) {
          processedData[field as keyof typeof processedData] = Number.parseFloat(
            processedData[field as keyof typeof processedData] as string,
          )
        } else {
          delete processedData[field as keyof typeof processedData]
        }
      })

      await updateLead(id, processedData)
      router.push(`/leads/${id}`)
    } catch (err: any) {
      console.error("Error updating lead:", err)
      setError(err.response?.data?.message || "Failed to update lead. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center">
        <Link href={`/leads/${id}`} className="mr-4 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Edit Lead</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Loan Information</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="loan_type" className="block text-sm font-medium text-gray-700">
                  Loan Type
                </label>
                <select
                  name="loan_type"
                  id="loan_type"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.loan_type}
                  onChange={handleChange}
                >
                  <option value="">Select Loan Type</option>
                  {loanTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="loan_purpose" className="block text-sm font-medium text-gray-700">
                  Loan Purpose
                </label>
                <select
                  name="loan_purpose"
                  id="loan_purpose"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.loan_purpose}
                  onChange={handleChange}
                >
                  <option value="">Select Loan Purpose</option>
                  {loanPurposes.map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <select
                  name="property_type"
                  id="property_type"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.property_type}
                  onChange={handleChange}
                >
                  <option value="">Select Property Type</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <select
                  name="state"
                  id="state"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="occupancy" className="block text-sm font-medium text-gray-700">
                  Occupancy
                </label>
                <select
                  name="occupancy"
                  id="occupancy"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.occupancy}
                  onChange={handleChange}
                >
                  <option value="">Select Occupancy</option>
                  {occupancyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="property_value" className="block text-sm font-medium text-gray-700">
                  Property Value ($)
                </label>
                <input
                  type="number"
                  name="property_value"
                  id="property_value"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.property_value}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="loan_value" className="block text-sm font-medium text-gray-700">
                  Loan Value ($)
                </label>
                <input
                  type="number"
                  name="loan_value"
                  id="loan_value"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.loan_value}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="fico_score" className="block text-sm font-medium text-gray-700">
                  FICO Score
                </label>
                <input
                  type="number"
                  name="fico_score"
                  id="fico_score"
                  min="300"
                  max="850"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.fico_score}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Rate Requirements</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="minimum_rate_needed" className="block text-sm font-medium text-gray-700">
                  Minimum Rate Needed (%)
                </label>
                <input
                  type="number"
                  name="minimum_rate_needed"
                  id="minimum_rate_needed"
                  step="0.001"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.minimum_rate_needed}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="maximum_points_needed" className="block text-sm font-medium text-gray-700">
                  Maximum Points Needed
                </label>
                <input
                  type="number"
                  name="maximum_points_needed"
                  id="maximum_points_needed"
                  step="0.001"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.maximum_points_needed}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-3 bg-gray-50 text-right">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Update Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
