"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Images", value: 85, color: "#3b82f6" },
  { name: "Videos", value: 45, color: "#ef4444" },
  { name: "Audio", value: 25, color: "#10b981" },
  { name: "Documents", value: 20, color: "#f59e0b" },
  { name: "Applications", value: 40, color: "#8b5cf6" },
  { name: "3D Models", value: 15, color: "#ec4899" },
  { name: "Code", value: 10, color: "#6366f1" },
  { name: "Other", value: 5, color: "#64748b" },
]

export function StorageUsage() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} GB`, "Storage"]}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
              borderRadius: "0.5rem",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

