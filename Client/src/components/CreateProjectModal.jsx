import { useState } from "react"
import { useProject } from "../contexts/ProjectContext"
import { X, Calendar, Target, FileText } from "lucide-react"
import { format } from "date-fns"

const CreateProjectModal = ({ isOpen, onClose }) => {
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "planning",
    priority: "medium",
    startDate: format(new Date(), "yyyy-MM-dd"),
    endDate: "",
    members: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { createProject } = useProject()

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
      newErrors.title = "Project title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Project description is required"
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required"
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date"
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
      await createProject(formData)
      onClose()
      // Reset form
      setFormData({
        title: "",
        description: "",
        status: "planning",
        priority: "medium",
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: "",
        members: [],
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
          <h2 className="text-2xl font-bold font-heading text-foreground">Create New Project</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Project Title</span>
              </div>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground ${errors.title ? "border-destructive" : "border-border"
                }`}
              placeholder="Enter project title"
            />
            {errors.title && <p className="mt-1 text-sm text-destructive">{errors.title}</p>}
          </div>

          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Description</span>
              </div>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground resize-none ${errors.description ? "border-destructive" : "border-border"
                }`}
              placeholder="Describe your project goals and objectives"
            />
            {errors.description && <p className="mt-1 text-sm text-destructive">{errors.description}</p>}
          </div>

          {/* Status and Priority */}
          <div className="grid md:grid-cols-2 gap-6">
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
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
                Priority
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
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Start Date</span>
                </div>
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>End Date</span>
                </div>
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                required
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground ${errors.endDate ? "border-destructive" : "border-border"
                  }`}
              />
              {errors.endDate && <p className="mt-1 text-sm text-destructive">{errors.endDate}</p>}
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
                  <span>Create Project</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProjectModal