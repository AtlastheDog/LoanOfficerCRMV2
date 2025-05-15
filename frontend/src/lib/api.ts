const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

interface FetchOptions extends RequestInit {
  token?: string
}

async function fetchAPI(endpoint: string, options: FetchOptions = {}) {
  const { token, ...fetchOptions } = options

  const headers = new Headers(options.headers)

  if (token) {
    headers.append("Authorization", `Bearer ${token}`)
  }

  if (options.body && !headers.has("Content-Type")) {
    headers.append("Content-Type", "application/json")
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "An error occurred")
  }

  // For 204 No Content responses
  if (response.status === 204) {
    return null
  }

  return response.json()
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (userData: any) =>
    fetchAPI("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: (token: string) =>
    fetchAPI("/auth/logout", {
      method: "POST",
      token,
    }),

  getCurrentUser: (token: string) => fetchAPI("/auth/me", { token }),
}

// Leads API
export const leadsAPI = {
  getLeads: (token: string, params = {}) =>
    fetchAPI("/leads", {
      token,
      method: "GET",
    }),

  getLead: (token: string, id: string) => fetchAPI(`/leads/${id}`, { token }),

  createLead: (token: string, leadData: any) =>
    fetchAPI("/leads", {
      method: "POST",
      body: JSON.stringify(leadData),
      token,
    }),

  updateLead: (token: string, id: string, leadData: any) =>
    fetchAPI(`/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify(leadData),
      token,
    }),

  deleteLead: (token: string, id: string) =>
    fetchAPI(`/leads/${id}`, {
      method: "DELETE",
      token,
    }),

  analyzeLead: (token: string, id: string) =>
    fetchAPI(`/leads/${id}/analyze`, {
      method: "POST",
      token,
    }),
}

// Rate Sheets API
export const rateSheetAPI = {
  uploadRateSheet: (token: string, formData: FormData) =>
    fetchAPI("/rate-sheets/upload", {
      method: "POST",
      body: formData,
      token,
      headers: {}, // Let the browser set the content type for FormData
    }),

  getRateSheets: (token: string) => fetchAPI("/rate-sheets", { token }),

  getRateSheetResults: (token: string, id: string) => fetchAPI(`/rate-sheets/${id}/results`, { token }),
}

// Dashboard API
export const dashboardAPI = {
  getStats: (token: string) => fetchAPI("/dashboard/stats", { token }),

  getRecentActivity: (token: string) => fetchAPI("/dashboard/activity", { token }),
}
