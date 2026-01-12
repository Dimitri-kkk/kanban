"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import type { FilterState } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  maxValue: number
}

export function FilterPanel({ filters, onFilterChange, maxValue }: FilterPanelProps) {
  const [searchInput, setSearchInput] = useState(filters.search)

  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({ ...filters, search: searchInput })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput, filters, onFilterChange])

  const activeFilterCount = [filters.search, filters.dateFrom, filters.dateTo, filters.minValue > 0].filter(
    Boolean,
  ).length

  const clearFilters = useCallback(() => {
    setSearchInput("")
    onFilterChange({
      search: "",
      dateFrom: "",
      dateTo: "",
      minValue: 0,
    })
  }, [onFilterChange])

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm text-foreground">Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFilterCount} active
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {/* Search */}
        <div className="space-y-1.5">
          <Label htmlFor="search" className="text-xs text-muted-foreground">
            Client Name
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search clients..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8 bg-input"
            />
          </div>
        </div>

        {/* Date From */}
        <div className="space-y-1.5">
          <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
            Event Date From
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
            className="bg-input"
          />
        </div>

        {/* Date To */}
        <div className="space-y-1.5">
          <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
            Event Date To
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
            className="bg-input"
          />
        </div>

        {/* Min Value */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Min Value: {formatCurrency(filters.minValue)}</Label>
          <Slider
            value={[filters.minValue]}
            max={maxValue}
            step={5000}
            onValueChange={([value]) => onFilterChange({ ...filters, minValue: value })}
            className="py-2"
          />
        </div>
      </div>
    </div>
  )
}
