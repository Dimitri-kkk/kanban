import { create } from "zustand"
import type { Inquiry, InquiryPhase, FilterState } from "./types"

interface InquiryStore {
  // Data
  inquiries: Inquiry[]
  selectedInquiry: Inquiry | null

  // UI State
  isLoading: boolean
  error: string | null
  draggedInquiry: Inquiry | null
  dragOverPhase: InquiryPhase | null

  // Filters
  filters: FilterState

  // Actions
  setInquiries: (inquiries: Inquiry[]) => void
  setSelectedInquiry: (inquiry: Inquiry | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setDraggedInquiry: (inquiry: Inquiry | null) => void
  setDragOverPhase: (phase: InquiryPhase | null) => void
  setFilters: (filters: FilterState) => void

  // Optimistic update for phase change
  updateInquiryPhase: (id: string, phase: InquiryPhase) => void
  rollbackInquiry: (inquiry: Inquiry) => void
}

export const useInquiryStore = create<InquiryStore>((set) => ({
  // Initial state
  inquiries: [],
  selectedInquiry: null,
  isLoading: true,
  error: null,
  draggedInquiry: null,
  dragOverPhase: null,
  filters: {
    search: "",
    dateFrom: "",
    dateTo: "",
    minValue: 0,
  },

  // Actions
  setInquiries: (inquiries) => set({ inquiries }),
  setSelectedInquiry: (inquiry) => set({ selectedInquiry: inquiry }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setDraggedInquiry: (inquiry) => set({ draggedInquiry: inquiry }),
  setDragOverPhase: (phase) => set({ dragOverPhase: phase }),
  setFilters: (filters) => set({ filters }),

  // Optimistic update
  updateInquiryPhase: (id, phase) =>
    set((state) => ({
      inquiries: state.inquiries.map((inq: Inquiry) =>
        inq.id === id ? { ...inq, phase, updatedAt: new Date().toISOString() } : inq,
      ),
      selectedInquiry:
        state.selectedInquiry?.id === id
          ? { ...state.selectedInquiry, phase, updatedAt: new Date().toISOString() }
          : state.selectedInquiry,
    })),

  // Rollback on error
  rollbackInquiry: (inquiry) =>
    set((state) => ({
      inquiries: state.inquiries.map((inq: Inquiry) => (inq.id === inquiry.id ? inquiry : inq)),
      selectedInquiry: state.selectedInquiry?.id === inquiry.id ? inquiry : state.selectedInquiry,
    })),
}))
