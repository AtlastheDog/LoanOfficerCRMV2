"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Upload, BarChart } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0">
      <div className="overflow-y-auto py-5 px-3 h-full bg-white">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className={`flex items-center p-2 text-base font-medium rounded-lg ${
                isActive("/") ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Home className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
              <span className="ml-3">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/leads"
              className={`flex items-center p-2 text-base font-medium rounded-lg ${
                pathname.startsWith("/leads") && !pathname.includes("/analyze")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Users className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
              <span className="ml-3">Leads</span>
            </Link>
          </li>
          <li>
            <Link
              href="/leads/analyze"
              className={`flex items-center p-2 text-base font-medium rounded-lg ${
                isActive("/leads/analyze")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <BarChart className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
              <span className="ml-3">Analyze Leads</span>
            </Link>
          </li>
          <li>
            <Link
              href="/rates/upload"
              className={`flex items-center p-2 text-base font-medium rounded-lg ${
                pathname.startsWith("/rates")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Upload className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
              <span className="ml-3">Add Rate Sheet</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}
