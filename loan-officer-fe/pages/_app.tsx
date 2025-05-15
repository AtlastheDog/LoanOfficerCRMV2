import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/auth-context"
import "@/styles/globals.css"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  )
}
