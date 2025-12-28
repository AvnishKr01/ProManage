import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Eye, EyeOff, UserPlus, FolderOpen } from "lucide-react"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "member",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const { register, error, clearError } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear validation errors
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
    if (error) clearError()
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await register(formData.name, formData.email, formData.password, formData.role)
    } catch (error) {
      // Error is handled by the context
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary to-primary opacity-90"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black font-heading text-white mb-4">Join ProjectHub</h1>
            <p className="text-xl text-white/90 max-w-md">
              Start managing your projects more efficiently. Collaborate with your team and track progress in real-time.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 text-white/80 text-sm max-w-sm">
            <div className="bg-white/10 rounded-lg p-4 text-left">
              <div className="font-semibold text-white mb-1">✓ Project Management</div>
              <div>Organize and track all your projects</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-left">
              <div className="font-semibold text-white mb-1">✓ Team Collaboration</div>
              <div>Work together seamlessly</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-left">
              <div className="font-semibold text-white mb-1">✓ Progress Tracking</div>
              <div>Monitor deadlines and milestones</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Register Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black font-heading text-foreground">ProjectHub</h1>
          </div>

          <h2 className="text-3xl font-bold font-heading text-foreground text-center mb-2">Create account</h2>
          <p className="text-muted-foreground text-center mb-8">Get started with your project management journey</p>

          <div className="bg-card rounded-xl shadow-sm border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground ${
                    validationErrors.name ? "border-destructive" : "border-border"
                  }`}
                  placeholder="Enter your full name"
                />
                {validationErrors.name && <p className="mt-1 text-sm text-destructive">{validationErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground ${
                    validationErrors.email ? "border-destructive" : "border-border"
                  }`}
                  placeholder="Enter your email"
                />
                {validationErrors.email && <p className="mt-1 text-sm text-destructive">{validationErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground"
                >
                  <option value="member">Team Member</option>
                  <option value="manager">Project Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground pr-12 ${
                      validationErrors.password ? "border-destructive" : "border-border"
                    }`}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-destructive">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-input border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground pr-12 ${
                      validationErrors.confirmPassword ? "border-destructive" : "border-border"
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-secondary text-secondary-foreground py-3 px-4 rounded-lg font-medium hover:bg-secondary/90 focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-secondary-foreground border-t-transparent"></div>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create account</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
