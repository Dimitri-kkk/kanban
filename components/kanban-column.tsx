"use client"

import type React from "react"
import { useCallback } from "react"
import type { Inquiry, InquiryPhase } from "@/lib/types"
import { InquiryCard } from "./inquiry-card"
import { formatCurrency, cn } from "@/lib/utils"
import { phaseConfig } from "@/lib/data"
import { Skeleton } from "@/components/ui/skeleton"

interface KanbanColumnProps {
  phase: InquiryPhase
  inquiries: Inquiry[]
  onCardClick: (inquiry: Inquiry) => void
  onDragStart: (inquiry: Inquiry) => void
  onDrop: (phase: InquiryPhase) => void
  isDragOver: boolean
  onDragOver: () => void
  onDragLeave: () => void
  draggedInquiryId: string | null
  isLoading?: boolean
}

export function KanbanColumn({
  phase,
  inquiries,
  onCardClick,
  onDragStart,
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave,
  draggedInquiryId,
  isLoading,
}: KanbanColumnProps) {
  const config = phaseConfig[phase]
  const totalValue = inquiries.reduce((sum, inq) => sum + inq.potentialValue, 0)

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      onDragOver()
    },
    [onDragOver],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDrop(phase)
    },
    [onDrop, phase],
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      // Only trigger if leaving the column entirely
      const relatedTarget = e.relatedTarget as HTMLElement
      if (!e.currentTarget.contains(relatedTarget)) {
        onDragLeave()
      }
    },
    [onDragLeave],
  )

  return (
    <div
      className={cn(
        "flex flex-col min-h-[500px] bg-secondary/30 rounded-lg transition-colors",
        isDragOver && "bg-primary/10 ring-2 ring-primary/30",
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <div className={cn("w-2 h-2 rounded-full", config.color)} />
          <h2 className="font-semibold text-sm text-foreground">{config.title}</h2>
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {inquiries.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Total: {formatCurrency(totalValue)}</p>
      </div>

      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </>
        ) : inquiries.length > 0 ? (
          inquiries.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              onClick={() => onCardClick(inquiry)}
              onDragStart={() => onDragStart(inquiry)}
              isDragging={draggedInquiryId === inquiry.id}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-24 text-sm text-muted-foreground border-2 border-dashed border-border rounded-lg">
            No inquiries
          </div>
        )}
      </div>
    </div>
  )
}
