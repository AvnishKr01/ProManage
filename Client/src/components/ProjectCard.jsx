import { Link } from "react-router-dom"
import { Calendar, Users, MoreVertical } from "lucide-react"
import { format, isAfter, differenceInDays } from "date-fns"
import { useState } from "react"
import { useProject } from "../contexts/ProjectContext"

export default function ProjectCard({ project }) {
  const [showMenu, setShowMenu] = useState(false)
  const { deleteProject } = useProject()

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

  const isOverdue = isAfter(new Date(), new Date(project.endDate))
  const daysUntilDeadline = differenceInDays(new Date(project.endDate), new Date())

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(project._id)
      } catch (error) {
        // Error is handled by the context
      }
    }
    setShowMenu(false)
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link
            to={`/projects/${project._id}`}
            className="text-lg font-semibold font-heading text-foreground hover:text-primary transition-colors line-clamp-2"
          >
            {project.title}
          </Link>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{project.description}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-popover border border-border rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
              <Link
                to={`/projects/${project._id}`}
                className="block px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                onClick={() => setShowMenu(false)}
              >
                View Details
              </Link>
              <button
                onClick={handleDelete}
                className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
              >
                Delete Project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Status and Priority */}
      <div className="flex items-center space-x-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
          {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">{project.progress}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary rounded-full h-2 transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Project Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Due {format(new Date(project.endDate), "MMM dd, yyyy")}</span>
          {isOverdue && <span className="text-destructive font-medium">(Overdue)</span>}
          {!isOverdue && daysUntilDeadline <= 7 && daysUntilDeadline > 0 && (
            <span className="text-chart-4 font-medium">({daysUntilDeadline} days left)</span>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>{project.members?.length || 0} team members</span>
        </div>
      </div>

      {/* Team Members */}
      {project.members && project.members.length > 0 && (
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member, index) => (
              <div
                key={member._id || index}
                className="w-8 h-8 bg-primary rounded-full border-2 border-card flex items-center justify-center text-xs font-medium text-primary-foreground"
                title={member.name}
              >
                {member.name?.charAt(0).toUpperCase()}
              </div>
            ))}
            {project.members.length > 3 && (
              <div className="w-8 h-8 bg-muted rounded-full border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
