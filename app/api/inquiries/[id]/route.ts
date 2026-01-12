import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { inquiriesDb } from "@/lib/db"
import type { Inquiry, InquiryPhase } from "@/lib/types"

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  // Simulate 500ms network delay
  await delay(500)

  const { id } = await params
  const body = await request.json()
  const { phase } = body as { phase: InquiryPhase }

  const inquiryIndex = inquiriesDb.findIndex((inq) => inq.id === id)

  if (inquiryIndex === -1) {
    console.log(`[PATCH] Inquiry ${id} not found in database`)
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
  }

  // Update the inquiry
  console.log(`[PATCH] Updating inquiry ${id} from phase ${inquiriesDb[inquiryIndex].phase} to ${phase}`)
  inquiriesDb[inquiryIndex] = {
    ...inquiriesDb[inquiryIndex],
    phase,
    updatedAt: new Date().toISOString(),
  }
  console.log(`[PATCH] Updated inquiry:`, inquiriesDb[inquiryIndex])
  console.log(`[PATCH] Database after update:`, inquiriesDb.map(i => ({ id: i.id, phase: i.phase })))

  return NextResponse.json({ inquiry: inquiriesDb[inquiryIndex] })
}
