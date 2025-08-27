"use client"

import { useState } from "react"
import { Calendar, MoreVertical, CheckSquare } from "lucide-react"
import { format, isAfter, differenceInDays } from "date-fns"
import { useProject } from "../contexts/ProjectContext"

export default function TaskList({ tasks, projects }) {
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortOrder, setSortOrder] = useState("asc")
  const { updateTask, deleteTask } = useProject()

  const getProjectTitle = (projectId) => {
    const project = projects.find((p) => p._id === projectId)
    return project?.title || "Unknown Project"
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

  const getStatusColor = (status) => {
    switch (status) {
      case "todo":
        return "bg-chart-4/10 text-chart-4"
      case "in-progress":
        return "bg-primary/10 text-primary"
      case "review":
        return "bg-secondary/10 text-secondary"
      case "completed":
        return "bg-chart-3/10 text-chart-3"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue, bValue

    switch (sortBy) {
      case "title":
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case "dueDate":
        aValue = new Date(a.dueDate)
        bValue = new Date(b.dueDate)
        break
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority] || 0
        bValue = priorityOrder[b.priority] || 0
        break
      case "status":
        const statusOrder = { todo: 1, "in-progress": 2, review: 3, completed: 4 }
        aValue = statusOrder[a.status] || 0
        bValue = statusOrder[b.status] || 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus })
    } catch (error) {
      // Error is handled by the context
    }
  }

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId)
      } catch (error) {
        // Error is handled by the context
      }
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Table Header */}
      <div className="bg-muted px-6 py-4 border-b border-border">
        <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-foreground">
          <div className="col-span-4">
            <button
              onClick={() => handleSort("title")}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <span>Task</span>
              {sortBy === "title" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort("status")}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <span>Status</span>
              {sortBy === "status" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort("priority")}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <span>Priority</span>
              {sortBy === "priority" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort("dueDate")}
              className="flex items-center space-x-1 hover:text-primary transition-colors"
            >
              <span>Due Date</span>
              {sortBy === "dueDate" && <span className="text-xs">{sortOrder === "asc" ? "↑" : "↓"}</span>}
            </button>
          </div>
          <div className="col-span-1">Assignee</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or create a new task.</p>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const isOverdue = isAfter(new Date(), new Date(task.dueDate)) && task.status !== "completed"
            const daysUntilDue = differenceInDays(new Date(task.dueDate), new Date())

            return (
              <div key={task._id} className="px-6 py-4 hover:bg-muted/50 transition-colors">
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Task Info */}
                  <div className="col-span-4">
                    <h4 className="font-medium text-foreground mb-1">{task.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{getProjectTitle(task.project)}</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-primary ${getStatusColor(task.status)}`}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className={isOverdue ? "text-destructive font-medium" : "text-foreground"}>
                        {format(new Date(task.dueDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                    {isOverdue && <span className="text-xs text-destructive font-medium">Overdue</span>}
                    {!isOverdue && daysUntilDue <= 3 && daysUntilDue >= 0 && (
                      <span className="text-xs text-chart-4 font-medium">{daysUntilDue} days left</span>
                    )}
                  </div>

                  {/* Assignee */}
                  <div className="col-span-1">
                    {task.assignedTo ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-primary-foreground">
                            {task.assignedTo.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <div className="relative">
                      <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
