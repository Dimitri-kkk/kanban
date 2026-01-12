"use client"

import { X, Calendar, Users, Building2, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Inquiry, InquiryPhase } from "@/lib/types"
import { formatCurrency, formatDate, formatRelativeDate, cn } from "@/lib/utils"
import { phaseConfig } from "@/lib/data"

interface InquiryDetailPanelProps {
  inquiry: Inquiry
  onClose: () => void
  onPhaseChange: (id: string, phase: InquiryPhase) => void
}

export function InquiryDetailPanel({ inquiry, onClose, onPhaseChange }: InquiryDetailPanelProps) {
  const isHighValue = inquiry.potentialValue > 50000

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-card border-l border-border shadow-xl overflow-y-auto animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">
                  {inquiry.id}
                </Badge>
                {isHighValue && <Badge className="bg-warning/20 text-warning text-xs">High Value</Badge>}
              </div>
              <h2 className="text-lg font-semibold text-foreground truncate">{inquiry.clientName}</h2>
              <p className="text-sm text-muted-foreground">{inquiry.contactPerson}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Phase Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phase</label>
            <Select value={inquiry.phase} onValueChange={(value: InquiryPhase) => onPhaseChange(inquiry.id, value)}>
              <SelectTrigger className="w-full bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(phaseConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", config.color)} />
                      {config.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Event Details</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">Type</span>
                </div>
                <p className="text-sm font-medium text-foreground">{inquiry.eventType}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Date</span>
                </div>
                <p className="text-sm font-medium text-foreground">{formatDate(inquiry.eventDate)}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs">Guests</span>
                </div>
                <p className="text-sm font-medium text-foreground">{inquiry.guestCount}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <span className="text-xs">Value (CHF)</span>
                </div>
                <p className="text-sm font-medium text-foreground">{formatCurrency(inquiry.potentialValue)}</p>
              </div>
            </div>
          </div>

          {/* Hotels */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Associated Hotels
            </label>
            {inquiry.hotels.length > 0 ? (
              <div className="space-y-2">
                {inquiry.hotels.map((hotel, index) => (
                  <div key={index} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{hotel}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No hotels assigned yet</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Notes</label>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-sm text-foreground leading-relaxed">{inquiry.notes || "No notes available"}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-3 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                Created: {formatDate(inquiry.createdAt)} ({formatRelativeDate(inquiry.createdAt)})
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                Last Updated: {formatDate(inquiry.updatedAt)} ({formatRelativeDate(inquiry.updatedAt)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
