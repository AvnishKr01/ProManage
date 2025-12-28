import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Eye, EyeOff, LogIn, FolderOpen } from "lucide-react"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { login, error, clearError } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
    } catch (error) {
      // Error is handled by the context
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary opacity-90"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black font-heading text-white mb-4">ProManage</h1>
            <p className="text-xl text-white/90 max-w-md">
              Streamline your projects, collaborate with your team, and achieve your goals efficiently.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-white/80 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white">500+</div>
              <div>Projects Completed</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="font-semibold text-white">50+</div>
              <div>Teams Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black font-heading text-foreground">ProjectHub</h1>
          </div>

          <h2 className="text-3xl font-bold font-heading text-foreground text-center mb-2">Welcome back</h2>
          <p className="text-muted-foreground text-center mb-8">Sign in to your account to continue</p>

          <div className="bg-card rounded-xl shadow-sm border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

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
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground"
                  placeholder="Enter your email"
                />
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
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground pr-12"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign in</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
