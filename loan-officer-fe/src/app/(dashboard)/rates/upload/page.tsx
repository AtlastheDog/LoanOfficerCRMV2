"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, FileText } from "lucide-react"
import { api } from "@/contexts/auth-context"

export default function RateSheetUpload() {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    ficoScoreGroup: "",
    loanTypeGroup: "",
    propertyValueGroup: "",
    loanValueGroup: "",
    loanPurposeGroup: "",
    state: "",
    occupancy: "",
  })

  const ficoScoreGroups = ["Low", "Medium", "High"]
  const loanTypeGroups = ["Conventional", "FHA", "VA/IRRL", "USDA"]
  const valueGroups = ["Low", "Medium", "High"]
  const loanPurposeGroups = ["Purchase", "No cash-out refinance", "Cash out refinance"]
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)

      // Create a preview for image files
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setFilePreview(null)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) {
      setError("Please select a rate sheet image to upload")
      return
    }

    setIsUploading(true)
    try {
      // Create form data for file upload
      const uploadData = new FormData()
      uploadData.append("file", selectedFile)

      // Upload the file
      const uploadResponse = await api.post("/api/images", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Get the uploaded file URL
      const fileUrl = uploadResponse.data.url

      // Submit the rate sheet data with the file URL
      await api.post("/api/rate_sheets", {
        file_url: fileUrl,
        ...formData,
      })

      // Navigate to results page
      router.push("/dashboard/rates/results")
    } catch (err) {
      console.error("Error uploading rate sheet:", err)
      setError("Failed to upload rate sheet. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center">
        <Link href="/dashboard" className="mr-4 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Upload Rate Sheet</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <p className="text-gray-700 mb-4">
            Upload a rate sheet image and provide scenario information to extract rates and points.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" id="rate-sheet" accept="image/*" className="hidden" onChange={handleFileChange} />
              <label htmlFor="rate-sheet" className="cursor-pointer flex flex-col items-center justify-center">
                {filePreview ? (
                  <div className="mb-4">
                    <img
                      src={filePreview || "/placeholder.svg"}
                      alt="Rate sheet preview"
                      className="max-h-64 max-w-full"
                    />
                  </div>
                ) : (
                  <>
                    <FileText className="h-12 w-12 text-gray-400 mb-3" />
                    <span className="text-gray-500">Drag and drop your rate sheet image here, or click to browse</span>
                    <span className="text-xs text-gray-400 mt-1">Supported formats: JPG, PNG, PDF</span>
                  </>
                )}
              </label>
              {selectedFile && <div className="mt-2 text-sm text-gray-500">Selected file: {selectedFile.name}</div>}
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="ficoScoreGroup" className="block text-sm font-medium text-gray-700">
                  FICO Score Group
                </label>
                <select
                  id="ficoScoreGroup"
                  name="ficoScoreGroup"
                  value={formData.ficoScoreGroup}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select FICO Score Group</option>
                  {ficoScoreGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="loanTypeGroup" className="block text-sm font-medium text-gray-700">
                  Loan Type
                </label>
                <select
                  id="loanTypeGroup"
                  name="loanTypeGroup"
                  value={formData.loanTypeGroup}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Loan Type</option>
                  {loanTypeGroups.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="propertyValueGroup" className="block text-sm font-medium text-gray-700">
                  Property Value Group
                </label>
                <select
                  id="propertyValueGroup"
                  name="propertyValueGroup"
                  value={formData.propertyValueGroup}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Property Value Group</option>
                  {valueGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="loanValueGroup" className="block text-sm font-medium text-gray-700">
                  Loan Value Group
                </label>
                <select
                  id="loanValueGroup"
                  name="loanValueGroup"
                  value={formData.loanValueGroup}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Loan Value Group</option>
                  {valueGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="loanPurposeGroup" className="block text-sm font-medium text-gray-700">
                  Loan Purpose
                </label>
                <select
                  id="loanPurposeGroup"
                  name="loanPurposeGroup"
                  value={formData.loanPurposeGroup}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Loan Purpose</option>
                  {loanPurposeGroups.map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
                  id="occupancy"
                  name="occupancy"
                  value={formData.occupancy}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Occupancy</option>
                  {occupancyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Rate Sheet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
