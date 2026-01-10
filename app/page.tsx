import { Suspense } from "react"
import { KanbanBoard } from "@/components/kanban-board"
import { LayoutDashboard } from "lucide-react"

function KanbanBoardWrapper() {
  return <KanbanBoard />
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Inquiry Kanban Board</h1>
              <p className="text-xs text-muted-foreground">B2B Event Management · Hotel Requests Pipeline</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
          <KanbanBoardWrapper />
        </Suspense>
      </main>
    </div>
  )
}
