"use client"

import { createContext, useContext, useReducer } from "react"
import { projectAPI, taskAPI } from "../services/api"
import toast from "react-hot-toast"

const ProjectContext = createContext()

const initialState = {
  projects: [],
  currentProject: null,
  tasks: [],
  loading: false,
  error: null,
}

function projectReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_PROJECTS":
      return { ...state, projects: action.payload, loading: false }
    case "SET_CURRENT_PROJECT":
      return { ...state, currentProject: action.payload, loading: false }
    case "SET_TASKS":
      return { ...state, tasks: action.payload, loading: false }
    case "ADD_PROJECT":
      return { ...state, projects: [action.payload, ...state.projects] }
    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) => (p._id === action.payload._id ? action.payload : p)),
        currentProject: state.currentProject?._id === action.payload._id ? action.payload : state.currentProject,
      }
    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p._id !== action.payload),
        currentProject: state.currentProject?._id === action.payload ? null : state.currentProject,
      }
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t._id === action.payload._id ? action.payload : t)),
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t._id !== action.payload),
      }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState)

  const fetchProjects = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await projectAPI.getProjects()
      dispatch({ type: "SET_PROJECTS", payload: response.data })
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch projects"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
    }
  }

  const fetchProject = async (id) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await projectAPI.getProject(id)
      dispatch({ type: "SET_CURRENT_PROJECT", payload: response.data })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch project"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
    }
  }

  const createProject = async (projectData) => {
    try {
      const response = await projectAPI.createProject(projectData)
      dispatch({ type: "ADD_PROJECT", payload: response.data })
      toast.success("Project created successfully!")
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create project"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      throw error
    }
  }

  const updateProject = async (id, projectData) => {
    try {
      const response = await projectAPI.updateProject(id, projectData)
      dispatch({ type: "UPDATE_PROJECT", payload: response.data })
      toast.success("Project updated successfully!")
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update project"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      throw error
    }
  }

  const deleteProject = async (id) => {
    try {
      await projectAPI.deleteProject(id)
      dispatch({ type: "DELETE_PROJECT", payload: id })
      toast.success("Project deleted successfully!")
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete project"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      throw error
    }
  }

  const fetchTasks = async (projectId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await taskAPI.getTasksByProject(projectId)
      dispatch({ type: "SET_TASKS", payload: response.data })
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch tasks"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
    }
  }

  const createTask = async (taskData) => {
    try {
      const response = await taskAPI.createTask(taskData)
      dispatch({ type: "ADD_TASK", payload: response.data })
      toast.success("Task created successfully!")
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create task"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      throw error
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      const response = await taskAPI.updateTask(id, taskData)
      dispatch({ type: "UPDATE_TASK", payload: response.data })
      toast.success("Task updated successfully!")
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update task"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      throw error
    }
  }

  const deleteTask = async (id) => {
    try {
      await taskAPI.deleteTask(id)
      dispatch({ type: "DELETE_TASK", payload: id })
      toast.success("Task deleted successfully!")
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete task"
      dispatch({ type: "SET_ERROR", payload: message })
      toast.error(message)
      throw error
    }
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value = {
    projects: state.projects,
    currentProject: state.currentProject,
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    clearError,
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}
