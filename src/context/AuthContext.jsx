import { createContext, useContext, useState, useCallback } from "react"
import { INITIAL_USERS } from "@/data/users.js"
import { useLocalStorage } from "@/hooks/useLocalStorage.js"
import { v4 as uuidv4 } from "uuid"

const AuthContext = createContext(null)

function getUsers() {
  try {
    const stored = localStorage.getItem("foodhub_users")
    return stored ? JSON.parse(stored) : INITIAL_USERS
  } catch {
    return INITIAL_USERS
  }
}

function saveUsers(users) {
  localStorage.setItem("foodhub_users", JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("foodhub_auth_user", null)
  const [loading, setLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const users = getUsers()
    const found = users.find(u => u.email === email && u.password === password && u.isActive)
    setLoading(false)
    if (!found) throw new Error("Invalid email or password")
    const { password: _pw, ...safeUser } = found
    setUser(safeUser)
    return safeUser
  }, [setUser])

  const register = useCallback(async (data) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const users = getUsers()
    if (users.some(u => u.email === data.email)) {
      setLoading(false)
      throw new Error("Email already registered")
    }
    const newUser = {
      id: uuidv4(),
      name: data.name,
      email: data.email,
      password: data.password,
      role: "customer",
      avatar: null,
      phone: data.phone || "",
      address: { street: "", city: "", state: "", zip: "", country: "" },
      createdAt: new Date().toISOString(),
      isActive: true,
    }
    const updated = [...users, newUser]
    saveUsers(updated)
    const { password: _pw, ...safeUser } = newUser
    setUser(safeUser)
    setLoading(false)
    return safeUser
  }, [setUser])

  const logout = useCallback(() => {
    setUser(null)
  }, [setUser])

  const updateProfile = useCallback((updates) => {
    const users = getUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return
    const updated = { ...users[idx], ...updates }
    users[idx] = updated
    saveUsers(users)
    const { password: _pw, ...safeUser } = updated
    setUser(safeUser)
  }, [user, setUser])

  const changePassword = useCallback((oldPw, newPw) => {
    const users = getUsers()
    const found = users.find(u => u.id === user.id)
    if (!found || found.password !== oldPw) throw new Error("Current password is incorrect")
    found.password = newPw
    saveUsers(users)
  }, [user])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
