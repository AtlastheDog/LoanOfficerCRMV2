"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowLeft, BarChart, Save } from "lucide-react"
import api from "../../services/api"
import LoadingSpinner from "../../components/shared/LoadingSpinner"

interface RatePoint {
  rate: number
  points: number
}

interface ScenarioData {
  ficoScoreGroup: string
  loanTypeGroup: string
  propertyValueGroup: string
  loanValueGroup: string
  loanPurposeGroup: string
  state: string
  occupancy: string
}

const RateSheetResults = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [ratePoints, setRatePoints] = useState<RatePoint[]>([])
  const [scenarioData, setScenarioData] = useState<ScenarioData | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await api.get("/results")
        setRatePoints(response.data.ocr_results || [])
        setScenarioData(response.data.scenario_data || null)
      } catch (err) {
        console.error("Error fetching OCR results:", err)
        setError("Failed to load rate sheet results. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const handleSaveRates = async () => {
    setIsSaving(true)
    try {
      await api.post("/rate_points", { rate_points: ratePoints, scenario: scenarioData })
      navigate("/")
    } catch (err) {
      console.error("Error saving rates:", err)
      setError("Failed to save rates. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAnalyzeLeads = async () => {
    setIsSaving(true)
    try {
      await api.post("/rate_points", { rate_points: ratePoints, scenario: scenarioData })
      navigate("/leads/analyze")
    } catch (err) {
      console.error("Error saving rates and analyzing leads:", err)
      setError("Failed to analyze leads. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex items-center">
        <Link to="/rates/upload" className="mr-4 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-semibold">Rate Sheet Results</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Scenario Information</h3>
          {scenarioData ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {scenarioData.ficoScoreGroup && (
                <div>
                  <p className="text-sm font-medium text-gray-500">FICO Score Group</p>
                  <p className="mt-1 text-sm text-gray-900">{scenarioData.ficoScoreGroup}</p>
                </div>
              )}
              {scenarioData.loanTypeGroup && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Loan Type</p>
                  <p className="mt-1 text-sm text-gray-900">{scenarioData.loanTypeGroup}</p>
                </div>
              )}
              {scenarioData.propertyValueGroup && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Property Value Group</p>
                  <p className="mt-1 text-sm text-gray-900">{scenarioData.propertyValueGroup}</p>
                </div>
              )}
              {scenarioData.loanValueGroup && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Loan Value Group</p>
                  <p className="mt-1 text-sm text-gray-900">{scenarioData.loanValueGroup}</p>
                </div>
              )}
              {scenarioData.loanPurposeGroup && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Loan Purpose</p>
                  <p className="mt-1 text-sm text-gray-900">{scenarioData.loanPurposeGroup}</p>
                </div>
              )}
              {scenarioData.state && (
                <div>
                  <p className="text-sm font-medium text-gray-500">State</p>
                  <p className="mt-1 text-sm text-gray-900">{scenarioData.state}</p>
                </div>
              )}
              {scenarioData.occupancy && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Occupancy</p>
                  <p className="mt-1 text-sm text-gray-900">{scenarioData.occupancy}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">No scenario data available</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Extracted Rate and Points</h3>
          <p className="mt-1 text-sm text-gray-500">
            Review the extracted rate and points information from the rate sheet.
          </p>
        </div>

        <div className="overflow-x-auto">
          {ratePoints.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ratePoints.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.rate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No rate and points data extracted from the rate sheet.</p>
              <Link
                to="/rates/upload"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Link>
            </div>
          )}
        </div>

        {ratePoints.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            <button
              onClick={handleSaveRates}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save Rates"}
            </button>
            <button
              onClick={handleAnalyzeLeads}
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              <BarChart className="w-4 h-4 mr-2" />
              {isSaving ? "Processing..." : "Analyze Leads"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default RateSheetResults
