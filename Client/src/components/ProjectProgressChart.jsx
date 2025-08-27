"use client"

import { BarChart3 } from "lucide-react"

export default function ProjectProgressChart({ projects }) {
  const getProgressData = () => {
    const progressRanges = [
      { range: "0-25%", count: 0, color: "bg-destructive" },
      { range: "26-50%", count: 0, color: "bg-chart-4" },
      { range: "51-75%", count: 0, color: "bg-primary" },
      { range: "76-100%", count: 0, color: "bg-chart-3" },
    ]

    projects.forEach((project) => {
      if (project.progress <= 25) progressRanges[0].count++
      else if (project.progress <= 50) progressRanges[1].count++
      else if (project.progress <= 75) progressRanges[2].count++
      else progressRanges[3].count++
    })

    return progressRanges
  }

  const progressData = getProgressData()
  const maxCount = Math.max(...progressData.map((d) => d.count), 1)

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold font-heading text-foreground">Project Progress Distribution</h3>
        <BarChart3 className="w-5 h-5 text-muted-foreground" />
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No project data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {progressData.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-16 text-sm text-muted-foreground">{item.range}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-6 relative overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    >
                      {item.count > 0 && <span className="text-xs font-medium text-white">{item.count}</span>}
                    </div>
                  </div>
                  <div className="w-8 text-sm font-medium text-foreground">{item.count}</div>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Projects</span>
              <span className="font-medium text-foreground">{projects.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
