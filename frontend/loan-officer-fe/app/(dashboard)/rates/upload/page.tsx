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
    setError("")

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("image", selectedFile)

      // Add scenario data
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          formDataToSend.append(
            `scenario[${key}]\`, value)  value]) => {
        if (value) {
          formDataToSend.append(\`scenario[${key}]`,
            value,
          )
        }
      })

      await api.post("/api/images", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Navigate to results page
      router.push("/rates/results")
    } catch (err: any) {
      console.error("Error uploading rate sheet:", err)
      setError(err.response?.data?.message || "Failed to upload rate sheet. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center">
        <Link href="/" className="mr-4 text-blue-600 hover:text-blue-800">
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
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Rate Sheet Categories</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select the categories that apply to this rate sheet. These will be used for matching leads.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="ficoScoreGroup" className="block text-sm font-medium text-gray-700">
                  FICO Score Group
                </label>
                <select
                  name="ficoScoreGroup"
                  id="ficoScoreGroup"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.ficoScoreGroup}
                  onChange={handleChange}
                  required
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
                  Loan Type Group
                </label>
                <select
                  name="loanTypeGroup"
                  id="loanTypeGroup"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.loanTypeGroup}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Loan Type Group</option>
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
                  name="propertyValueGroup"
                  id="propertyValueGroup"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.propertyValueGroup}
                  onChange={handleChange}
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
                  name="loanValueGroup"
                  id="loanValueGroup"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.loanValueGroup}
                  onChange={handleChange}
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
                  Loan Purpose Group
                </label>
                <select
                  name="loanPurposeGroup"
                  id="loanPurposeGroup"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={formData.loanPurposeGroup}
                  onChange={handleChange}
                >
                  <option value="">Select Loan Purpose Group</option>
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
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upload Rate Sheet Image</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload an image of the rate sheet. The system will extract rate and points information.
            </p>
            <div className="mt-4">
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {filePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <img
                    src={filePreview || "/placeholder.svg"}
                    alt="Rate sheet preview"
                    className="max-h-64 rounded border"
                  />
                </div>
              )}
              {selectedFile && !filePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Selected file:</p>
                  <p className="text-sm text-gray-500">{selectedFile.name}</p>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-3 bg-gray-50 text-right">
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Rate Sheet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
