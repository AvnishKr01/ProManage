"use client"

import { useAuth } from "../contexts/AuthContext"
import { LogOut, User, Bell } from "lucide-react"

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Project Management</h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">{user?.name}</p>
                <p className="text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
