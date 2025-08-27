"use client"

import { useState } from "react"
import { useProject } from "../contexts/ProjectContext"
import { X, Target, Calendar, User, AlertCircle } from "lucide-react"
import { format, addDays } from "date-fns"

export default function CreateTaskModal({ isOpen, onClose, projects }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    dueDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    project: projects[0]?._id || "",
    assignedTo: "",
    estimatedHours: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { createTask } = useProject()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required"
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required"
    }

    if (!formData.project) {
      newErrors.project = "Project is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const taskData = {
        ...formData,
        estimatedHours: formData.estimatedHours ? Number.parseInt(formData.estimatedHours) : 0,
        assignedTo: formData.assignedTo || undefined,
      }

      await createTask(taskData)
      onClose()
      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: format(addDays(new Date(), 7), "yyyy-MM-dd"),
        project: projects[0]?._id || "",
        assignedTo: "",
        estimatedHours: "",
      })
    } catch (error) {
      // Error is handled by the context
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-white/70 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold font-heading text-foreground">Create New Task</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Task Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Task Title</span>
              </div>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground ${
                errors.title ? "border-destructive" : "border-border"
              }`}
              placeholder="Enter task title"
            />
            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Task Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground resize-none ${
                errors.description ? "border-destructive" : "border-border"
              }`}
              placeholder="Describe the task requirements and objectives"
            />
            {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description}</p>}
          </div>

          {/* Project Selection */}
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-foreground mb-2">
              Project
            </label>
            <select
              id="project"
              name="project"
              required
              value={formData.project}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground ${
                errors.project ? "border-destructive" : "border-border"
              }`}
            >
              <option value="">Select a project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
            {errors.project && <p className="mt-1 text-sm text-destructive">{errors.project}</p>}
          </div>

          {/* Status, Priority, and Due Date */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Priority</span>
                </div>
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due Date</span>
                </div>
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                required
                value={formData.dueDate}
                onChange={handleChange}
                min={format(new Date(), "yyyy-MM-dd")}
                className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground ${
                  errors.dueDate ? "border-destructive" : "border-border"
                }`}
              />
              {errors.dueDate && <p className="mt-1 text-sm text-destructive">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Assignment and Estimation */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Assign To</span>
                </div>
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground"
              >
                <option value="">Unassigned</option>
                {/* In a real app, you'd populate this with team members */}
                <option value="current-user">Assign to me</option>
              </select>
            </div>

            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-foreground mb-2">
                Estimated Hours
              </label>
              <input
                id="estimatedHours"
                name="estimatedHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.estimatedHours}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground"
                placeholder="0"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  <span>Create Task</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
