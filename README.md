# Inquiry Kanban Board

A Next.js application for managing B2B event inquiries through a visual Kanban board interface. Built as part of the smti ERP System.

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/
│   │   └── inquiries/
│   │       ├── route.ts          # GET /api/inquiries (with filters)
│   │       └── [id]/
│   │           └── route.ts      # PATCH /api/inquiries/:id
│   ├── globals.css               # Tailwind + design tokens
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── filter-panel.tsx          # Filter controls with debounce
│   ├── inquiry-card.tsx          # Draggable card component
│   ├── inquiry-detail-panel.tsx  # Slide-in detail view
│   ├── kanban-board.tsx          # Main board orchestrator
│   └── kanban-column.tsx         # Column with drop zone
├── hooks/
│   ├── use-inquiries.ts          # SWR hook for API + optimistic updates
│   └── use-url-filters.ts        # URL param sync for filters
├── lib/
│   ├── data.ts                   # Sample data + phase config
│   ├── store.ts                  # Zustand store
│   ├── types.ts                  # TypeScript interfaces
│   └── utils.ts                  # Formatting utilities
└── DECISIONS.md                  # Technical decisions
```

## Libraries Used

| Library | Purpose |
|---------|---------|
| **Next.js 15** | React framework with App Router and API routes |
| **Zustand** | Lightweight state management for UI state |
| **SWR** | Data fetching, caching, and optimistic updates |
| **Tailwind CSS v4** | Utility-first styling |
| **shadcn/ui** | Pre-built accessible components |
| **Lucide React** | Icon library |

### Why These Libraries?

- **Zustand over Redux**: Simpler API, less boilerplate, perfect for this scope
- **SWR over React Query**: Lighter weight, built-in optimistic updates, Vercel ecosystem alignment
- **Native HTML5 Drag and Drop**: No extra library needed, good browser support, straightforward implementation

## Features

- Drag and drop cards between 4 phase columns
- Filter by client name (debounced), date range, minimum value
- URL-persisted filter state (shareable links)
- Optimistic updates with automatic rollback on error
- High-value indicator for inquiries > CHF 50,000
- Responsive design (works on tablet)
- Loading and error states
- Mock API with 500ms simulated delay
