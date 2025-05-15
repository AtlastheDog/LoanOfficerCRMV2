"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { User, LogOut, Menu } from "lucide-react"
import { useState } from "react"

interface NavbarProps {
  user: { email: string } | null
}

export default function Navbar({ user }: NavbarProps) {
  const { logout } = useAuth()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start items-center">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 mr-2 text-gray-600 rounded-lg md:hidden hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <Link href="/" className="flex items-center justify-between mr-4">
            <span className="self-center text-2xl font-semibold whitespace-nowrap">Loan Officer CRM</span>
          </Link>
        </div>
        <div className="flex items-center lg:order-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center p-2 text-sm text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100"
            >
              <User className="w-6 h-6 mr-1" />
              <span className="hidden md:inline-block">{user?.email}</span>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
