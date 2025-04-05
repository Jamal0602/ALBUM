import { Heart } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t py-4">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built for <span className="font-medium">direct.cubiz.space</span>. All rights reserved.
        </p>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>Made with</span> <Heart className="h-4 w-4 fill-current text-red-500" /> <span>by Cubiz</span>
        </p>
      </div>
    </footer>
  )
}

