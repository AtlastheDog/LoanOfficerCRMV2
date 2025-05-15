"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface User {
  id: number
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, passwordConfirmation: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5173",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
})

// Add interceptors
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      // Next.js will handle redirects differently
    }
    return Promise.reject(error)
  },
)

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if running in browser
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setUser(null)
          setLoading(false)
          return
        }

        const response = await api.get("/users/current")
        setUser(response.data)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await api.post("/users/sign_in", {
        user: { email, password },
      })

      // Store authentication token
      const token = response.headers.authorization
      if (token) {
        localStorage.setItem("token", token)
        api.defaults.headers.common["Authorization"] = token
      }

      setUser(response.data.user)
      router.push("/")
    } catch (error) {
      throw new Error("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, passwordConfirmation: string) => {
    setLoading(true)
    try {
      const response = await api.post("/users", {
        user: { email, password, password_confirmation: passwordConfirmation },
      })

      // Store authentication token
      const token = response.headers.authorization
      if (token) {
        localStorage.setItem("token", token)
        api.defaults.headers.common["Authorization"] = token
      }

      setUser(response.data.user)
      router.push("/")
    } catch (error) {
      throw new Error("Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await api.delete("/users/sign_out")
      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { api }
