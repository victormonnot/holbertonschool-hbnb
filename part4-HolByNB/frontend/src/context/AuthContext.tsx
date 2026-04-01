import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, logout as apiLogout, getTokenPayload, getUser, type User } from "../lib/api"

interface AuthState {
  user: User | null
  isAdmin: boolean
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const payload = getTokenPayload()
    if (payload) {
      setIsAdmin(payload.is_admin)
      getUser(payload.sub).then(setUser).catch(() => {
        apiLogout()
        setUser(null)
      })
    }
  }, [])

  const login = async (email: string, password: string) => {
    await apiLogin(email, password)
    const payload = getTokenPayload()!
    setIsAdmin(payload.is_admin)
    const u = await getUser(payload.sub)
    setUser(u)
  }

  const logout = () => {
    apiLogout()
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
