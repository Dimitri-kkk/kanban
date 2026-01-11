"use client"

import { useMemo, useCallback } from "react"
import type { Inquiry, InquiryPhase } from "@/lib/types"
import { useInquiryStore } from "@/lib/store"
import { useUrlFilters } from "@/hooks/use-url-filters"
import { useInquiries } from "@/hooks/use-inquiries"
import { KanbanColumn } from "./kanban-column"
import { FilterPanel } from "./filter-panel"
import { InquiryDetailPanel } from "./inquiry-detail-panel"
import { formatCurrency } from "@/lib/utils"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const phases: InquiryPhase[] = ["new", "sent_to_hotels", "offers_received", "completed"]

export function KanbanBoard() {
  const { selectedInquiry, setSelectedInquiry, draggedInquiry, setDraggedInquiry, dragOverPhase, setDragOverPhase } =
    useInquiryStore()

  const { filters, updateUrlFilters } = useUrlFilters()
  const { inquiries, isLoading, error, changePhase } = useInquiries(filters)

  const maxValue = useMemo(() => Math.max(...inquiries.map((i) => i.potentialValue), 100000), [inquiries])

  const inquiriesByPhase = useMemo(() => {
    const grouped: Record<InquiryPhase, Inquiry[]> = {
      new: [],
      sent_to_hotels: [],
      offers_received: [],
      completed: [],
    }
    inquiries.forEach((inquiry) => {
      grouped[inquiry.phase].push(inquiry)
    })
    return grouped
  }, [inquiries])

  const totalStats = useMemo(() => {
    const total = inquiries.reduce((sum, i) => sum + i.potentialValue, 0)
    return { count: inquiries.length, value: total }
  }, [inquiries])

  const handleDragStart = useCallback(
    (inquiry: Inquiry) => {
      setDraggedInquiry(inquiry)
    },
    [setDraggedInquiry],
  )

  const handleDrop = useCallback(
    (targetPhase: InquiryPhase) => {
      if (draggedInquiry && draggedInquiry.phase !== targetPhase) {
        changePhase(draggedInquiry, targetPhase)
      }
      setDraggedInquiry(null)
      setDragOverPhase(null)
    },
    [draggedInquiry, changePhase, setDraggedInquiry, setDragOverPhase],
  )

  const handlePhaseChange = useCallback(
    (id: string, newPhase: InquiryPhase) => {
      const inquiry = inquiries.find((inq) => inq.id === id)
      if (inquiry) {
        changePhase(inquiry, newPhase)
        // Update selected inquiry if it's the one being changed
        if (selectedInquiry?.id === id) {
          setSelectedInquiry({ ...selectedInquiry, phase: newPhase })
        }
      }
    },
    [inquiries, changePhase, selectedInquiry, setSelectedInquiry],
  )

  const handleCardClick = useCallback(
    (inquiry: Inquiry) => {
      setSelectedInquiry(inquiry)
    },
    [setSelectedInquiry],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading inquiries...
            </span>
          ) : (
            <>
              Showing <span className="font-medium text-foreground">{totalStats.count}</span> inquiries · Total value:{" "}
              <span className="font-medium text-foreground">{formatCurrency(totalStats.value)}</span>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FilterPanel filters={filters} onFilterChange={updateUrlFilters} maxValue={maxValue} />

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {phases.map((phase) => (
          <KanbanColumn
            key={phase}
            phase={phase}
            inquiries={inquiriesByPhase[phase]}
            onCardClick={handleCardClick}
            onDragStart={handleDragStart}
            onDrop={handleDrop}
            onDragOver={() => setDragOverPhase(phase)}
            onDragLeave={() => setDragOverPhase(null)}
            isDragOver={dragOverPhase === phase && draggedInquiry?.phase !== phase}
            draggedInquiryId={draggedInquiry?.id ?? null}
            isLoading={isLoading}
          />
        ))}
      </div>

      {selectedInquiry && (
        <InquiryDetailPanel
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onPhaseChange={handlePhaseChange}
        />
      )}
    </div>
  )
}
