"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createLead } from "@/lib/api"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

interface LeadForm {
  first_name: string
  last_name: string
  email: string
  phone: string
  loan_type: string
  loan_purpose: string
  property_type: string
  property_value: string
  loan_value: string
  fico_score: string
  state: string
  occupancy: string
  minimum_rate_needed: string
  maximum_points_needed: string
}

const CreateLead = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<LeadForm>({
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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const loanTypes = ["Conventional", "FHA", "VA/IRRL", "USDA"]
  const loanPurposes = ["Purchase", "No cash-out refinance", "Cash out refinance"]
  const propertyTypes = ["SFR", "Condo", "MultiUnit", "PUD"]
  const occupancyTypes = ["Primary", "Secondary", "Investment"]
  const states = [
    "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
    "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
    "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
    "VA","WA","WV","WI","WY"
  ]

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

      const processedData: Record<string, string | number> = { ...formData }

      numericFields.forEach((field) => {
        if (processedData[field]) {
          processedData[field] = Number.parseFloat(processedData[field] as string)
        }
      })

      const response = await createLead(processedData)
      router.push(`/leads/${response.id}`)
    } catch (err: any) {
      console.error("Error creating lead:", err)
      setError(err.response?.data?.message || "Failed to create lead. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center">
        <Link href="/leads" className="mr-4 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Create New Lead</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
          <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
          <select name="loan_type" value={formData.loan_type} onChange={handleChange}>
            <option value="">Loan Type</option>
            {loanTypes.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <select name="loan_purpose" value={formData.loan_purpose} onChange={handleChange}>
            <option value="">Loan Purpose</option>
            {loanPurposes.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <select name="property_type" value={formData.property_type} onChange={handleChange}>
            <option value="">Property Type</option>
            {propertyTypes.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <select name="occupancy" value={formData.occupancy} onChange={handleChange}>
            <option value="">Occupancy</option>
            {occupancyTypes.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="">State</option>
            {states.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <input name="property_value" value={formData.property_value} onChange={handleChange} placeholder="Property Value" type="number" />
          <input name="loan_value" value={formData.loan_value} onChange={handleChange} placeholder="Loan Value" type="number" />
          <input name="fico_score" value={formData.fico_score} onChange={handleChange} placeholder="FICO Score" type="number" />
          <input name="minimum_rate_needed" value={formData.minimum_rate_needed} onChange={handleChange} placeholder="Min Rate Needed" type="number" />
          <input name="maximum_points_needed" value={formData.maximum_points_needed} onChange={handleChange} placeholder="Max Points Needed" type="number" />
        </div>

        <div className="mt-6 text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Lead"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateLead
