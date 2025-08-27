"use client"
import { TrendingUp } from "lucide-react"

export default function TaskCompletionChart({ tasks, timeRange }) {
  const getCompletionData = () => {
    // Mock data for demonstration - in a real app, you'd calculate this from actual task data
    const mockData = {
      week: [
        { day: "Mon", completed: 5, total: 8 },
        { day: "Tue", completed: 3, total: 6 },
        { day: "Wed", completed: 7, total: 9 },
        { day: "Thu", completed: 4, total: 7 },
        { day: "Fri", completed: 6, total: 8 },
        { day: "Sat", completed: 2, total: 3 },
        { day: "Sun", completed: 1, total: 2 },
      ],
      month: [
        { day: "Week 1", completed: 18, total: 25 },
        { day: "Week 2", completed: 22, total: 28 },
        { day: "Week 3", completed: 15, total: 20 },
        { day: "Week 4", completed: 19, total: 24 },
      ],
    }

    return mockData[timeRange] || mockData.week
  }

  const data = getCompletionData()
  const maxTotal = Math.max(...data.map((d) => d.total), 1)

  const totalCompleted = data.reduce((sum, d) => sum + d.completed, 0)
  const totalTasks = data.reduce((sum, d) => sum + d.total, 0)
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold font-heading text-foreground">Task Completion Trend</h3>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-chart-3" />
          <span className="text-sm font-medium text-chart-3">{completionRate}% completion rate</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-12 text-sm text-muted-foreground">{item.day}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs text-muted-foreground">
                  {item.completed}/{item.total} tasks
                </span>
                <span className="text-xs font-medium text-foreground">
                  {Math.round((item.completed / item.total) * 100)}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-muted rounded-full h-4">
                  <div
                    className="bg-chart-3 rounded-full h-4 transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${(item.completed / item.total) * 100}%` }}
                  ></div>
                </div>
                <div
                  className="absolute top-0 bg-muted-foreground/20 rounded-full h-4"
                  style={{ width: `${(item.total / maxTotal) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-chart-3">{totalCompleted}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">{totalTasks}</div>
            <div className="text-xs text-muted-foreground">Total Tasks</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">{completionRate}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
