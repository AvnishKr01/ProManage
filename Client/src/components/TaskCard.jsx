"use client"

import { useState } from "react"
import { Calendar, MoreVertical } from "lucide-react"
import { format, isAfter, differenceInDays } from "date-fns"
import { useProject } from "../contexts/ProjectContext"

export default function TaskCard({ task }) {
  const [showMenu, setShowMenu] = useState(false)
  const { deleteTask } = useProject()

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

  const isOverdue = isAfter(new Date(), new Date(task.dueDate)) && task.status !== "completed"
  const daysUntilDue = differenceInDays(new Date(task.dueDate), new Date())

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(task._id)
      } catch (error) {
        // Error is handled by the context
      }
    }
    setShowMenu(false)
  }

  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-foreground line-clamp-2 flex-1">{task.title}</h4>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-popover border border-border rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
              <button className="block w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                Edit Task
              </button>
              <button
                onClick={handleDelete}
                className="block w-full text-left px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
              >
                Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

      {/* Priority */}
      <div className="flex items-center space-x-2 mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        {isOverdue && (
          <span className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-medium">Overdue</span>
        )}
      </div>

      {/* Due Date */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
        <Calendar className="w-4 h-4" />
        <span>Due {format(new Date(task.dueDate), "MMM dd")}</span>
        {!isOverdue && daysUntilDue <= 3 && daysUntilDue >= 0 && (
          <span className="text-chart-4 font-medium">({daysUntilDue} days)</span>
        )}
      </div>

      {/* Assignee */}
      {task.assignedTo && (
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-foreground">
              {task.assignedTo.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">{task.assignedTo.name}</span>
        </div>
      )}

      {/* Project Info */}
      {task.projectTitle && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{task.projectTitle}</span>
        </div>
      )}
    </div>
  )
}
