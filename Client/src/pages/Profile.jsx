import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { User, Mail, Shield, Edit3, Save, X } from "lucide-react"

export default function Profile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // TODO: Implement profile update API call
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    })
    setIsEditing(false)
  }

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive"
      case "manager":
        return "bg-secondary/10 text-secondary"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  const getRoleIcon = (role) => {
    return <Shield className="w-4 h-4" />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading text-foreground mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information Card */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold font-heading text-foreground">Personal Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">{user?.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground"
                />
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="text-foreground">{user?.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground mb-2">Role</label>
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              {getRoleIcon(user?.role)}
              <span className="text-foreground capitalize">{user?.role}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                {user?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold font-heading text-foreground mb-6">Account Statistics</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">12</div>
              <div className="text-sm text-muted-foreground">Projects Created</div>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-lg">
              <div className="text-2xl font-bold text-secondary mb-1">48</div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
            </div>
            <div className="text-center p-4 bg-chart-3/10 rounded-lg">
              <div className="text-2xl font-bold text-chart-3 mb-1">6</div>
              <div className="text-sm text-muted-foreground">Team Collaborations</div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold font-heading text-foreground mb-6">Security</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-medium text-foreground">Password</h3>
                <p className="text-sm text-muted-foreground">Last updated 30 days ago</p>
              </div>
              <button className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                Change Password
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <h3 className="font-medium text-foreground">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
