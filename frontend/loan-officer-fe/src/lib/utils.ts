import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

// Format percentage
export function formatPercentage(value: number): string {
  return `${value}%`
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

// Format date and time
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString()
}
