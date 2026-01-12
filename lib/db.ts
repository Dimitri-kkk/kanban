import { sampleInquiries } from "./data"
import type { Inquiry } from "./types"

// Shared in-memory database across all API routes
// Use a global to persist across module reloads in dev mode since I had some issues with that..
declare global {
  var inquiriesDbInstance: Inquiry[]
}

if (!global.inquiriesDbInstance) {
  global.inquiriesDbInstance = JSON.parse(JSON.stringify(sampleInquiries))
}

export const inquiriesDb: Inquiry[] = global.inquiriesDbInstance
