"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback, useEffect } from "react"
import type { FilterState } from "@/lib/types"
import { useInquiryStore } from "@/lib/store"

export function useUrlFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const { filters, setFilters } = useInquiryStore()

  // Initialize filters from URL on mount
  useEffect(() => {
    const urlFilters: FilterState = {
      search: searchParams.get("search") || "",
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
      minValue: Number.parseInt(searchParams.get("minValue") || "0", 10),
    }
    setFilters(urlFilters)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync filters to URL
  const updateUrlFilters = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters)

      const params = new URLSearchParams()
      if (newFilters.search) params.set("search", newFilters.search)
      if (newFilters.dateFrom) params.set("dateFrom", newFilters.dateFrom)
      if (newFilters.dateTo) params.set("dateTo", newFilters.dateTo)
      if (newFilters.minValue > 0) params.set("minValue", String(newFilters.minValue))

      const queryString = params.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
    },
    [pathname, router, setFilters],
  )

  return { filters, updateUrlFilters }
}
