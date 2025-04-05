"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "Jan",
    total: 12.4,
  },
  {
    name: "Feb",
    total: 15.1,
  },
  {
    name: "Mar",
    total: 18.6,
  },
  {
    name: "Apr",
    total: 22.4,
  },
  {
    name: "May",
    total: 24.8,
  },
  {
    name: "Jun",
    total: 28.3,
  },
  {
    name: "Jul",
    total: 31.9,
  },
  {
    name: "Aug",
    total: 34.2,
  },
  {
    name: "Sep",
    total: 36.5,
  },
  {
    name: "Oct",
    total: 42.7,
  },
  {
    name: "Nov",
    total: 46.2,
  },
  {
    name: "Dec",
    total: 49.5,
  },
]

export function Overview() {
  return (
    <ChartContainer
      config={{
        total: {
          label: "Storage (GB)",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value} GB`} />
          <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
          <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} className="fill-primary" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

