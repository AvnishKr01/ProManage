import { useState, useEffect } from "react"
import { useProject } from "../contexts/ProjectContext"
import { Plus, Search, Filter, LayoutGrid, List } from "lucide-react"
import { TaskBoard, TaskList, CreateTaskModal, LoadingSpinner } from "./Index"

export default function Tasks() {
  const { projects, tasks, loading, fetchProjects } = useProject()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState("board") // 'board' or 'list'
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    project: "all",
    status: "all",
    priority: "all",
    assignee: "all",
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  // Get all tasks from all projects
  const allTasks = projects.reduce((acc, project) => {
    // In a real app, you'd fetch tasks for each project
    // For now, we'll use the tasks from context
    return acc.concat(tasks.map((task) => ({ ...task, projectTitle: project.title })))
  }, [])

  const filteredTasks = allTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProject = filters.project === "all" || task.project === filters.project
    const matchesStatus = filters.status === "all" || task.status === filters.status
    const matchesPriority = filters.priority === "all" || task.priority === filters.priority
    const matchesAssignee = filters.assignee === "all" || task.assignedTo?._id === filters.assignee

    return matchesSearch && matchesProject && matchesStatus && matchesPriority && matchesAssignee
  })

  const getTaskStats = () => {
    return {
      total: allTasks.length,
      todo: allTasks.filter((t) => t.status === "todo").length,
      inProgress: allTasks.filter((t) => t.status === "in-progress").length,
      review: allTasks.filter((t) => t.status === "review").length,
      completed: allTasks.filter((t) => t.status === "completed").length,
      overdue: allTasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "completed").length,
    }
  }

  const stats = getTaskStats()

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  if (loading && projects.length === 0) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground mb-2">Tasks</h1>
          <p className="text-muted-foreground">Manage and track all your tasks across projects</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>New Task</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-foreground mb-1">{stats.total}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-chart-4 mb-1">{stats.todo}</div>
          <div className="text-sm text-muted-foreground">To Do</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-primary mb-1">{stats.inProgress}</div>
          <div className="text-sm text-muted-foreground">In Progress</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-secondary mb-1">{stats.review}</div>
          <div className="text-sm text-muted-foreground">Review</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-chart-3 mb-1">{stats.completed}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-2xl font-bold text-destructive mb-1">{stats.overdue}</div>
          <div className="text-sm text-muted-foreground">Overdue</div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground placeholder-muted-foreground"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />

              <select
                value={filters.project}
                onChange={(e) => handleFilterChange("project", e.target.value)}
                className="px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground text-sm"
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>

              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                className="px-3 py-2 bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors text-foreground text-sm"
              >
                <option value="all">All Priority</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <button
                onClick={() => setViewMode("board")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "board"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Board</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task View */}
      {viewMode === "board" ? (
        <TaskBoard tasks={filteredTasks} />
      ) : (
        <TaskList tasks={filteredTasks} projects={projects} />
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} projects={projects} />
      )}
    </div>
  )
}
