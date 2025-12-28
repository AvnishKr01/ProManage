import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useProject } from "../contexts/ProjectContext"
import {
  ArrowLeft,
  Calendar,
  Users,
  Target,
  BarChart3,
  Edit3,
  Trash2,
  Plus,
  CheckSquare,
  AlertCircle,
} from "lucide-react"
import { format, isAfter, differenceInDays } from "date-fns"
import LoadingSpinner from "../components/LoadingSpinner"

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentProject, loading, fetchProject, deleteProject, fetchTasks, tasks } = useProject()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (id) {
      fetchProject(id)
      fetchTasks(id)
    }
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(id)
        navigate("/projects")
      } catch (error) {
        // Error is handled by the context
      }
    }
  }

  if (loading || !currentProject) {
    return <LoadingSpinner />
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "planning":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20"
      case "active":
        return "bg-primary/10 text-primary border-primary/20"
      case "completed":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20"
      case "on-hold":
        return "bg-muted text-muted-foreground border-border"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive/10 text-destructive"
      case "high":
        return "bg-secondary/10 text-secondary"
      case "medium":
        return "bg-chart-4/10 text-chart-4"
      case "low":
        return "bg-chart-3/10 text-chart-3"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const isOverdue = isAfter(new Date(), new Date(currentProject.endDate))
  const daysUntilDeadline = differenceInDays(new Date(currentProject.endDate), new Date())

  const getTaskStats = () => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      review: tasks.filter((t) => t.status === "review").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }
  }

  const taskStats = getTaskStats()

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/projects")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground mb-2">{currentProject.title}</h1>
            <p className="text-muted-foreground">{currentProject.description}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <Edit3 className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Status</span>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentProject.status)}`}
          >
            {currentProject.status.charAt(0).toUpperCase() + currentProject.status.slice(1)}
          </span>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-2">
            <AlertCircle className="w-5 h-5 text-secondary" />
            <span className="font-medium text-foreground">Priority</span>
          </div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(currentProject.priority)}`}
          >
            {currentProject.priority.charAt(0).toUpperCase() + currentProject.priority.slice(1)}
          </span>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-5 h-5 text-chart-4" />
            <span className="font-medium text-foreground">Deadline</span>
          </div>
          <div>
            <div className="text-sm text-foreground">{format(new Date(currentProject.endDate), "MMM dd, yyyy")}</div>
            {isOverdue ? (
              <div className="text-xs text-destructive font-medium">Overdue</div>
            ) : daysUntilDeadline <= 7 && daysUntilDeadline > 0 ? (
              <div className="text-xs text-chart-4 font-medium">{daysUntilDeadline} days left</div>
            ) : (
              <div className="text-xs text-muted-foreground">{daysUntilDeadline} days left</div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="w-5 h-5 text-chart-3" />
            <span className="font-medium text-foreground">Progress</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground mb-1">{currentProject.progress}%</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-300"
                style={{ width: `${currentProject.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-lg border border-border mb-8">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "tasks"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Tasks ({taskStats.total})
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "team"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Team ({currentProject.members?.length || 0})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Task Statistics */}
              <div>
                <h3 className="text-lg font-semibold font-heading text-foreground mb-4">Task Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">{taskStats.total}</div>
                    <div className="text-sm text-muted-foreground">Total Tasks</div>
                  </div>
                  <div className="bg-chart-4/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-chart-4 mb-1">{taskStats.todo}</div>
                    <div className="text-sm text-muted-foreground">To Do</div>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{taskStats.inProgress}</div>
                    <div className="text-sm text-muted-foreground">In Progress</div>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-secondary mb-1">{taskStats.review}</div>
                    <div className="text-sm text-muted-foreground">Review</div>
                  </div>
                  <div className="bg-chart-3/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-chart-3 mb-1">{taskStats.completed}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </div>

              {/* Project Timeline */}
              <div>
                <h3 className="text-lg font-semibold font-heading text-foreground mb-4">Timeline</h3>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-muted-foreground">Started:</span>
                      <span className="ml-2 text-foreground font-medium">
                        {format(new Date(currentProject.startDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due:</span>
                      <span className="ml-2 text-foreground font-medium">
                        {format(new Date(currentProject.endDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold font-heading text-foreground">Project Tasks</h3>
                <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-foreground mb-2">No tasks yet</h4>
                  <p className="text-muted-foreground mb-4">Create your first task to get started.</p>
                  <button className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Create First Task</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task._id} className="bg-muted rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground mb-1">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>Due: {format(new Date(task.dueDate), "MMM dd")}</span>
                            {task.assignedTo && <span>Assigned to: {task.assignedTo.name}</span>}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === "completed"
                              ? "bg-chart-3/10 text-chart-3"
                              : task.status === "in-progress"
                                ? "bg-primary/10 text-primary"
                                : task.status === "review"
                                  ? "bg-secondary/10 text-secondary"
                                  : "bg-chart-4/10 text-chart-4"
                          }`}
                        >
                          {task.status.replace("-", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "team" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold font-heading text-foreground">Team Members</h3>
                <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* Project Owner */}
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-medium">
                        {currentProject.owner?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{currentProject.owner?.name}</h4>
                      <p className="text-sm text-muted-foreground">{currentProject.owner?.email}</p>
                    </div>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Owner</span>
                  </div>
                </div>

                {/* Team Members */}
                {currentProject.members?.map((member) => (
                  <div key={member._id} className="bg-muted rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-secondary-foreground font-medium">
                          {member.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium capitalize">
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}

                {(!currentProject.members || currentProject.members.length === 0) && (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-foreground mb-2">No team members yet</h4>
                    <p className="text-muted-foreground mb-4">Invite team members to collaborate on this project.</p>
                    <button className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>Invite Members</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
