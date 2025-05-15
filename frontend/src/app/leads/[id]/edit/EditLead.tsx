"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import api from "@/services/api"
import LoadingSpinner from "@/components/shared/LoadingSpinner"

interface EditLeadProps {
  params: { id: string }
}

const EditLead = ({ params }: EditLeadProps) => {
  const router = useRouter()
  const id = params.id

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
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA",
    "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT",
    "VA", "WA", "WV", "WI", "WY"
  ]

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await api.get(`/leads/${id}`)
        const lead = response.data.lead
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

    fetchLead()
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
            processedData[field as keyof typeof processedData] as string
          )
        } else {
          delete processedData[field as keyof typeof processedData]
        }
      })

      await api.put(`/leads/${id}`, { lead: processedData })
      router.push(`/leads/${id}`)
    } catch (err: any) {
      console.error("Error updating lead:", err)
      setError(err.response?.data?.message || "Failed to update lead. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <LoadingSpinner />

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

      {/* ... form JSX remains the same */}
    </div>
  )
}

export default EditLead
