"use client"

import { useState, useEffect } from "react"
import { useProject } from "../contexts/ProjectContext"
import { useAuth } from "../contexts/AuthContext"
import { CheckSquare, AlertTriangle, Plus, Calendar, Users, Target, Activity } from "lucide-react"
import { format, isAfter, startOfWeek, endOfWeek, isWithinInterval } from "date-fns"
import ProjectProgressChart from "../components/ProjectProgressChart"
import TaskCompletionChart from "../components/TaskCompletionChart"
import RecentActivity from "../components/RecentActivity"
import UpcomingDeadlines from "../components/UpcomingDeadlines"

export default function Dashboard() {
  const { user } = useAuth()
  const { projects, tasks, loading, fetchProjects } = useProject()
  const [timeRange, setTimeRange] = useState("week") // 'week', 'month', 'quarter'

  useEffect(() => {
    fetchProjects()
  }, [])

  // Calculate dashboard statistics
  const getDashboardStats = () => {
    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)

    // All tasks from all projects (in a real app, you'd aggregate this properly)
    const allTasks = projects.reduce((acc, project) => {
      return acc.concat(tasks.map((task) => ({ ...task, projectTitle: project.title })))
    }, [])

    const completedTasks = allTasks.filter((task) => task.status === "completed")
    const overdueTasks = allTasks.filter((task) => isAfter(now, new Date(task.dueDate)) && task.status !== "completed")
    const thisWeekTasks = allTasks.filter((task) =>
      isWithinInterval(new Date(task.dueDate), { start: weekStart, end: weekEnd }),
    )

    const activeProjects = projects.filter((project) => project.status === "active")
    const completedProjects = projects.filter((project) => project.status === "completed")

    const totalProgress = projects.reduce((sum, project) => sum + project.progress, 0)
    const averageProgress = projects.length > 0 ? Math.round(totalProgress / projects.length) : 0

    return {
      totalProjects: projects.length,
      activeProjects: activeProjects.length,
      completedProjects: completedProjects.length,
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      overdueTasks: overdueTasks.length,
      thisWeekTasks: thisWeekTasks.length,
      averageProgress,
      completionRate: allTasks.length > 0 ? Math.round((completedTasks.length / allTasks.length) * 100) : 0,
    }
  }

  const stats = getDashboardStats()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const getRecentProjects = () => {
    return projects
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 4)
  }

  const getUpcomingDeadlines = () => {
    const now = new Date()
    const allTasks = projects.reduce((acc, project) => {
      return acc.concat(tasks.map((task) => ({ ...task, projectTitle: project.title })))
    }, [])

    return allTasks
      .filter((task) => task.status !== "completed" && new Date(task.dueDate) > now)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5)
  }

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-muted border-t-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center space-x-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/90 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
          <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
              <p className="text-3xl font-bold text-foreground">{stats.totalProjects}</p>
              <p className="text-sm text-chart-3 mt-1">
                <span className="font-medium">{stats.activeProjects}</span> active
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Task Completion</p>
              <p className="text-3xl font-bold text-foreground">{stats.completionRate}%</p>
              <p className="text-sm text-chart-3 mt-1">
                <span className="font-medium">{stats.completedTasks}</span> of {stats.totalTasks}
              </p>
            </div>
            <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-chart-3" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">This Week</p>
              <p className="text-3xl font-bold text-foreground">{stats.thisWeekTasks}</p>
              <p className="text-sm text-primary mt-1">tasks due</p>
            </div>
            <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-chart-4" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Overdue Tasks</p>
              <p className="text-3xl font-bold text-foreground">{stats.overdueTasks}</p>
              <p className="text-sm text-destructive mt-1">need attention</p>
            </div>
            <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProjectProgressChart projects={projects} />
        <TaskCompletionChart tasks={tasks} timeRange={timeRange} />
      </div>

      {/* Recent Projects and Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold font-heading text-foreground">Recent Projects</h3>
            <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {getRecentProjects().length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No projects yet</p>
                <button className="mt-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                  Create your first project
                </button>
              </div>
            ) : (
              getRecentProjects().map((project) => (
                <div key={project._id} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Due {format(new Date(project.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-foreground">{project.progress}%</div>
                    <div className="w-16 bg-muted-foreground/20 rounded-full h-2 mt-1">
                      <div
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <UpcomingDeadlines deadlines={getUpcomingDeadlines()} />
      </div>

      {/* Team Activity and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Performance */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold font-heading text-foreground">Team Performance</h3>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Average Progress</span>
              <span className="text-sm font-medium text-foreground">{stats.averageProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${stats.averageProgress}%` }}
              ></div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Projects On Track</span>
                <span className="text-sm font-medium text-chart-3">
                  {projects.filter((p) => p.status === "active").length}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Projects Completed</span>
                <span className="text-sm font-medium text-chart-3">{stats.completedProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tasks This Week</span>
                <span className="text-sm font-medium text-primary">{stats.thisWeekTasks}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold font-heading text-foreground mb-6">Quick Actions</h3>

          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 text-left bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Create Project
                </div>
                <div className="text-sm text-muted-foreground">Start a new project</div>
              </div>
            </button>

            <button className="w-full flex items-center space-x-3 p-3 text-left bg-secondary/5 hover:bg-secondary/10 rounded-lg transition-colors group">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-secondary-foreground" />
              </div>
              <div>
                <div className="font-medium text-foreground group-hover:text-secondary transition-colors">Add Task</div>
                <div className="text-sm text-muted-foreground">Create a new task</div>
              </div>
            </button>

            <button className="w-full flex items-center space-x-3 p-3 text-left bg-chart-3/5 hover:bg-chart-3/10 rounded-lg transition-colors group">
              <div className="w-8 h-8 bg-chart-3 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-medium text-foreground group-hover:text-chart-3 transition-colors">
                  Invite Team
                </div>
                <div className="text-sm text-muted-foreground">Add team members</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </div>
  )
}
