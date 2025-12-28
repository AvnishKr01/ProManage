import { useState } from "react"
import { useProject } from "../contexts/ProjectContext"
import TaskCard from "./TaskCard"
import { Plus } from "lucide-react"

const columns = [
  { id: "todo", title: "To Do", color: "bg-chart-4/10 border-chart-4/20" },
  { id: "in-progress", title: "In Progress", color: "bg-primary/10 border-primary/20" },
  { id: "review", title: "Review", color: "bg-secondary/10 border-secondary/20" },
  { id: "completed", title: "Completed", color: "bg-chart-3/10 border-chart-3/20" },
]

export default function TaskBoard({ tasks }) {
  const { updateTask } = useProject()
  const [draggedTask, setDraggedTask] = useState(null)

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status)
  }

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== newStatus) {
      try {
        await updateTask(draggedTask._id, { status: newStatus })
      } catch (error) {
        // Error is handled by the context
      }
    }
    setDraggedTask(null)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id)
        return (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className={`rounded-lg border p-4 mb-4 ${column.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{columnTasks.length}</span>
                  <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Column Content */}
            <div
              className="flex-1 space-y-3 min-h-[200px] p-2 rounded-lg border-2 border-dashed border-transparent transition-colors"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
              style={{
                borderColor: draggedTask ? "var(--border)" : "transparent",
              }}
            >
              {columnTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-sm">No tasks</div>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div key={task._id} draggable onDragStart={(e) => handleDragStart(e, task)} className="cursor-move">
                    <TaskCard task={task} />
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
