"use client"

import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbProps {
  path: string[]
  onNavigate: (path: string[]) => void
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <button onClick={() => onNavigate(["public"])} className="flex items-center hover:text-foreground">
        <Home className="h-4 w-4 mr-1" />
      </button>

      {path.map((segment, index) => {
        // Skip the first "public" segment in display
        if (index === 0 && segment === "public") return null

        const currentPath = path.slice(0, index + 1)

        return (
          <div key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            <button onClick={() => onNavigate(currentPath)} className="hover:text-foreground">
              {segment}
            </button>
          </div>
        )
      })}
    </div>
  )
}
