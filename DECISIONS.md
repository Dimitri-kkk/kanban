# Technical Decisions

## Drag and Drop Approach

**Decision:** Native HTML5 Drag and Drop API

**Why:**
- No additional dependencies required
- Good browser support (all modern browsers)
- Sufficient for column-to-column drag operations
- Simpler implementation for this use case

**Alternatives Considered:**
- `@dnd-kit/core`: More features but adds ~15KB, overkill for 4 columns
- `react-beautiful-dnd`: Deprecated, maintenance concerns
- `@hello-pangea/dnd`: Good option but native API was sufficient

**Trade-offs:**
- Less polished animations than dedicated libraries
- No built-in touch support (would need additional work for mobile)
- Manual drop zone highlighting

---

## State Management

**Decision:** Zustand for UI state + SWR for server state

**Why:**
- Clear separation between UI state (selected card, drag state) and server state (inquiries)
- Zustand is lightweight (~1KB) with minimal boilerplate
- SWR handles caching, revalidation, and optimistic updates elegantly
- Both integrate naturally with React's mental model

**Structure:**
```
Zustand Store (UI State)
├── selectedInquiry
├── draggedInquiry
├── dragOverPhase
└── filters (synced to URL)

SWR (Server State)
├── inquiries data
├── loading/error states
└── optimistic mutation helpers
```

**Alternatives Considered:**
- React Context alone: Would work but less ergonomic for complex state
- Redux Toolkit: Heavier, more setup, unnecessary for this scope
- Jotai/Recoil: Good options, but Zustand is more established

---

## UX Decisions

### 1. Slide-in Panel vs Modal

**Decision:** Slide-in panel from right

**Why:**
- Maintains context of the board while viewing details
- Natural for side-by-side comparison
- Common pattern in project management tools (Jira, Linear)

### 2. Filter Persistence in URL

**Decision:** Sync all filters to URL params

**Why:**
- Shareable filtered views
- Browser back/forward navigation works
- Refresh preserves state
- Good for collaboration ("check this filtered view")

### 3. Debounced Search

**Decision:** 300ms debounce on client name search

**Why:**
- Prevents excessive API calls while typing
- Responsive enough to feel instant
- Standard practice for search inputs

### 4. High-Value Indicator

**Decision:** Gold left border + badge for >50K CHF

**Why:**
- Immediately visible without reading values
- Consistent with business requirement
- Non-intrusive visual hierarchy

---

## What I Would Improve With More Time

1. **Touch/Mobile Support:** Add touch event handlers for drag-and-drop on mobile devices

2. **Keyboard Navigation:** Full keyboard accessibility for moving cards between columns

3. **Undo Functionality:** Toast with "Undo" action after phase changes

4. **Bulk Actions:** Select multiple cards to move or update together

5. **Real-time Updates:** WebSocket integration for multi-user collaboration

6. **Animation Polish:** Smoother card transitions using Framer Motion

7. **Testing:** Add unit tests for store logic and integration tests for drag-drop

8. **Error Boundaries:** Graceful error handling at component level

9. **Virtualization:** For boards with 100+ cards, virtualize the lists

10. **Offline Support:** Queue changes when offline, sync when back online
