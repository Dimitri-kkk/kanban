import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { inquiriesDb } from "@/lib/db"
import type { Inquiry } from "@/lib/types"

// Simulating network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function GET(request: NextRequest) {
  // Simulate 500ms network delay
  await delay(500)

  console.log(`[GET] Current database state:`, inquiriesDb.map(i => ({ id: i.id, phase: i.phase })))

  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const dateFrom = searchParams.get("dateFrom") || ""
  const dateTo = searchParams.get("dateTo") || ""
  const minValue = Number.parseInt(searchParams.get("minValue") || "0", 10)

  let filtered = [...inquiriesDb]

  // Apply filters
  if (search) {
    filtered = filtered.filter((inq) => inq.clientName.toLowerCase().includes(search.toLowerCase()))
  }

  if (dateFrom) {
    filtered = filtered.filter((inq) => inq.eventDate >= dateFrom)
  }

  if (dateTo) {
    filtered = filtered.filter((inq) => inq.eventDate <= dateTo)
  }

  if (minValue > 0) {
    filtered = filtered.filter((inq) => inq.potentialValue >= minValue)
  }

  return NextResponse.json({ inquiries: filtered })
}
