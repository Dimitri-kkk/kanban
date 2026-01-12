"use client"

import { useCallback } from "react"
import useSWR from "swr"
import type { Inquiry, InquiryPhase, FilterState } from "@/lib/types"
import { useInquiryStore } from "@/lib/store"

interface InquiriesResponse {
  inquiries: Inquiry[]
}

// Fetcher function for SWR
const fetcher = async (url: string): Promise<InquiriesResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch inquiries")
  return res.json()
}

// Build query string from filters
const buildQueryString = (filters: FilterState): string => {
  const params = new URLSearchParams()
  if (filters.search) params.set("search", filters.search)
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
  if (filters.dateTo) params.set("dateTo", filters.dateTo)
  if (filters.minValue > 0) params.set("minValue", String(filters.minValue))
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ""
}

export function useInquiries(filters: FilterState) {
  const { updateInquiryPhase, rollbackInquiry } = useInquiryStore()

  const queryString = buildQueryString(filters)
  const { data, error, isLoading, mutate } = useSWR<InquiriesResponse>(`/api/inquiries${queryString}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  })

  // Optimistic phase update
  const changePhase = useCallback(
    async (inquiry: Inquiry, newPhase: InquiryPhase) => {
      if (inquiry.phase === newPhase) return

      const originalInquiry = { ...inquiry }

      // Optimistic update - immediately update the UI
      updateInquiryPhase(inquiry.id, newPhase)

      // Also update SWR cache optimistically
      mutate(
        (current) => {
          if (!current) return current
          return {
            inquiries: current.inquiries.map((inq) =>
              inq.id === inquiry.id ? { ...inq, phase: newPhase, updatedAt: new Date().toISOString() } : inq,
            ),
          }
        },
        { revalidate: false },
      )

      try {
        console.log(`[changePhase] Sending PATCH to update inquiry ${inquiry.id} to phase: ${newPhase}`)
        const res = await fetch(`/api/inquiries/${inquiry.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phase: newPhase }),
        })

        if (!res.ok) {
          throw new Error("Failed to update inquiry")
        }

        const responseData = await res.json()
        console.log(`[changePhase] PATCH successful, response:`, responseData)

        // Revalidate to ensure consistency
        console.log(`[changePhase] Calling mutate() to revalidate`)
        const newData = await mutate()
        console.log(`[changePhase] Revalidation complete, new data:`, newData)
      } catch (err) {
        // Rollback on error
        rollbackInquiry(originalInquiry)
        mutate()
        console.error("Failed to update inquiry phase:", err)
      }
    },
    [mutate, updateInquiryPhase, rollbackInquiry],
  )

  console.log("Inquiries data:", data)

  return {
    inquiries: data?.inquiries ?? [],
    isLoading,
    error: error?.message ?? null,
    changePhase,
    refetch: mutate,
  }
}
