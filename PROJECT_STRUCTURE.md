# Matrix Coaching Center - Project Structure

## Directory Architecture

```
matrix-coaching/
├── src/
│   ├── app/                          # Next.js 13+ App Router
│   │   ├── layout.tsx                # Root layout (global nav, footer)
│   │   ├── page.tsx                  # Home/Landing page
│   │   ├── schedules/
│   │   │   └── page.tsx              # Interactive schedule & fees
│   │   ├── results/
│   │   │   └── page.tsx              # Results & Hall of Fame
│   │   ├── contact/
│   │   │   └── page.tsx              # Contact & Admissions
│   │   └── globals.css               # Tailwind imports
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Navigation bar
│   │   │   ├── Footer.tsx            # Footer with contact info
│   │   │   └── Container.tsx         # Content wrapper
│   │   ├── home/
│   │   │   ├── Hero.tsx              # Landing hero section
│   │   │   ├── Features.tsx          # Key highlights
│   │   │   └── LocationMap.tsx       # Address & map embed
│   │   ├── schedules/
│   │   │   ├── ClassFilter.tsx       # Class selection dropdown
│   │   │   ├── BatchCard.tsx         # Individual batch display
│   │   │   └── ScheduleGrid.tsx      # Grid layout for batches
│   │   ├── results/
│   │   │   ├── ResultsHero.tsx       # Top performers showcase
│   │   │   ├── YearFilter.tsx        # Filter by academic year
│   │   │   └── AchievementCard.tsx   # Student achievement display
│   │   ├── contact/
│   │   │   ├── ContactForm.tsx       # Form with WhatsApp fallback
│   │   │   └── ContactInfo.tsx       # Phone, email, address
│   │   └── ui/
│   │       ├── Button.tsx            # Reusable button
│   │       ├── Card.tsx              # Card component
│   │       └── Badge.tsx             # Labels/tags
│   │
│   ├── data/                         # Static JSON data (Phase 1)
│   │   ├── center-info.json          # Basic center details
│   │   ├── schedules.json            # Class schedules & fees
│   │   ├── results.json              # Student results & achievements
│   │   └── testimonials.json         # Student/parent reviews
│   │
│   ├── lib/                          # Utility functions
│   │   ├── data-fetchers.ts          # Functions to load JSON data
│   │   └── types.ts                  # TypeScript interfaces
│   │
│   └── hooks/                        # Custom React hooks
│       └── useScheduleFilter.ts      # Schedule filtering logic
│
├── public/                           # Static assets
│   ├── images/
│   │   ├── logo.png
│   │   ├── hero-bg.jpg
│   │   └── achievements/
│   └── favicon.ico
│
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS config
├── tsconfig.json                     # TypeScript config
├── package.json
└── README.md
```

## Why This Structure?

### 1. **App Router Over Pages Router**
- **Reasoning:** App Router is the future of Next.js, better for static exports
- **Benefit:** Improved performance, better SEO, cleaner data fetching

### 2. **Component Organization by Feature**
- **Reasoning:** Easy to locate and modify related components
- **Benefit:** When adding Phase 2 features, you know exactly where to add code

### 3. **Separate Data Layer (`src/data/`)**
- **Reasoning:** Non-developers can update JSON files without touching code
- **Benefit:** In Phase 2, swap `import data from '@/data/file.json'` with `const data = await fetch('/api/...')`

### 4. **Centralized Data Fetchers (`src/lib/data-fetchers.ts`)**
- **Reasoning:** Single source of truth for data loading logic
- **Benefit:** When migrating to Supabase/Firebase, update only ONE file

### 5. **Type Safety (`src/lib/types.ts`)**
- **Reasoning:** Prevents bugs, improves DX with autocomplete
- **Benefit:** Contract between frontend and future backend is pre-defined

## Phase 2 Migration Path

```typescript
// Phase 1: Local JSON
export async function getSchedules() {
  return require('@/data/schedules.json');
}

// Phase 2: Just update this function!
export async function getSchedules() {
  const { data } = await supabase.from('schedules').select('*');
  return data;
}
```

All components remain unchanged! 🎯
