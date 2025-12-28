import { Activity, CheckSquare, Target, Users, Clock } from "lucide-react"
import { format } from "date-fns"

export default function RecentActivity() {
  // Mock activity data - in a real app, this would come from an activity log
  const activities = [
    {
      id: 1,
      type: "task_completed",
      message: "completed task 'Design homepage mockup'",
      project: "Website Redesign",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: CheckSquare,
      color: "text-chart-3",
    },
    {
      id: 2,
      type: "project_created",
      message: "created new project 'Mobile App Development'",
      project: null,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      icon: Target,
      color: "text-primary",
    },
    {
      id: 3,
      type: "team_joined",
      message: "joined the 'Marketing Campaign' project",
      project: "Marketing Campaign",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: Users,
      color: "text-secondary",
    },
    {
      id: 4,
      type: "task_assigned",
      message: "was assigned 'Review user feedback'",
      project: "Product Research",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      icon: Clock,
      color: "text-chart-4",
    },
  ]

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const diffInHours = Math.floor((now - timestamp) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours === 1) return "1 hour ago"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return format(timestamp, "MMM dd")
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold font-heading text-foreground">Recent Activity</h3>
        <Activity className="w-5 h-5 text-muted-foreground" />
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => {
            const IconComponent = activity.icon
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className={`w-4 h-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    You <span className="font-medium">{activity.message}</span>
                  </p>
                  {activity.project && <p className="text-xs text-muted-foreground mt-1">in {activity.project}</p>}
                  <p className="text-xs text-muted-foreground mt-1">{getTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <button className="w-full text-center text-primary hover:text-primary/80 text-sm font-medium transition-colors">
            View All Activity
          </button>
        </div>
      )}
    </div>
  )
}
