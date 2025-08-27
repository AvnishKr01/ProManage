"use client"

import { createContext, useContext, useReducer, useEffect } from "react"
import { authAPI } from "../services/api"
import toast from "react-hot-toast"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_USER":
      return { ...state, user: action.payload, loading: false, error: null }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      }
    case "LOGOUT":
      localStorage.removeItem("token")
      return { ...state, user: null, token: null, loading: false, error: null }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await authAPI.getCurrentUser()
          dispatch({ type: "SET_USER", payload: response.data.user })
        } catch (error) {
          localStorage.removeItem("token")
          dispatch({ type: "SET_ERROR", payload: "Session expired" })
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await authAPI.login(email, password)
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data })
      toast.success("Login successful!")
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || "Login failed"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      throw error
    }
  }

  const register = async (name, email, password, role = "member") => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await authAPI.register(name, email, password, role)
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data })
      toast.success("Registration successful!")
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    dispatch({ type: "LOGOUT" })
    toast.success("Logged out successfully")
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
