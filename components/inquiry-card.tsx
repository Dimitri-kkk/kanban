"use client"

import type React from "react"
import { Calendar, Users, Building2, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Inquiry } from "@/lib/types"
import { formatCurrency, formatRelativeDate, formatDate, cn } from "@/lib/utils"

interface InquiryCardProps {
  inquiry: Inquiry
  onClick: () => void
  isDragging?: boolean
  onDragStart: (e: React.DragEvent) => void
}

export function InquiryCard({ inquiry, onClick, isDragging, onDragStart }: InquiryCardProps) {
  const isHighValue = inquiry.potentialValue > 50000

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", inquiry.id)
    onDragStart(e)
  }

  return (
    <Card
      className={cn(
        "p-3 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
        "bg-card border-border",
        isDragging && "opacity-50 rotate-2 scale-105 shadow-xl",
        isHighValue && "border-l-4 border-l-warning",
      )}
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">{inquiry.clientName}</h3>
            <p className="text-xs text-muted-foreground truncate">{inquiry.contactPerson}</p>
          </div>
          {isHighValue && (
            <Badge variant="secondary" className="bg-warning/20 text-warning shrink-0">
              <Sparkles className="w-3 h-3 mr-1" />
              High
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(inquiry.eventDate)}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {inquiry.guestCount}
          </span>
        </div>

        {inquiry.hotels.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {inquiry.hotels.length} hotel{inquiry.hotels.length > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-border">
          <Badge variant="outline" className="text-xs">
            {inquiry.eventType}
          </Badge>
          <span className="text-sm font-semibold text-foreground">{formatCurrency(inquiry.potentialValue)}</span>
        </div>

        <p className="text-xs text-muted-foreground">Updated {formatRelativeDate(inquiry.updatedAt)}</p>
      </div>
    </Card>
  )
}
