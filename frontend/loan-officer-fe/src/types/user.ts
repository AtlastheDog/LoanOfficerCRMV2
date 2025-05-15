export interface User {
  id: number
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}
