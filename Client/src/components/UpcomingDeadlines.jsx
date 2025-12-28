import { Calendar, AlertTriangle, Clock } from "lucide-react"
import { format, differenceInDays } from "date-fns"

export default function UpcomingDeadlines({ deadlines }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "text-destructive"
      case "high":
        return "text-secondary"
      case "medium":
        return "text-chart-4"
      case "low":
        return "text-chart-3"
      default:
        return "text-muted-foreground"
    }
  }

  const getUrgencyColor = (daysLeft) => {
    if (daysLeft <= 1) return "text-destructive"
    if (daysLeft <= 3) return "text-chart-4"
    return "text-muted-foreground"
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold font-heading text-foreground">Upcoming Deadlines</h3>
        <Calendar className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {deadlines.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming deadlines</p>
            <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
          </div>
        ) : (
          deadlines.map((task) => {
            const daysLeft = differenceInDays(new Date(task.dueDate), new Date())
            return (
              <div key={task._id} className="flex items-center space-x-4 p-3 bg-muted rounded-lg">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  {daysLeft <= 1 ? (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  ) : (
                    <Clock className="w-5 h-5 text-secondary-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">{task.projectTitle}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(task.dueDate), "MMM dd")}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getUrgencyColor(daysLeft)}`}>
                    {daysLeft === 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `${daysLeft} days`}
                  </div>
                  {daysLeft <= 1 && <div className="text-xs text-destructive">Urgent</div>}
                </div>
              </div>
            )
          })
        )}
      </div>

      {deadlines.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-center text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            View All Deadlines
          </button>
        </div>
      )}
    </div>
  )
}
