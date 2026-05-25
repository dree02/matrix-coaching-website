# Matrix Academy - Official Website

A blazing-fast, modern, and professional static website for an academy serving 1,000+ students in Delhi. Built with Next.js 14 and deployed on Cloudflare Pages for **zero-cost hosting**.

## 🎯 Project Vision

### Phase 1 (Current): Pure Frontend
- ✅ Fully static site (HTML/CSS/JS only)
- ✅ Interactive schedule browser with filters
- ✅ Results showcase and Hall of Fame
- ✅ WhatsApp-based contact forms
- ✅ Zero hosting costs on Cloudflare Pages

### Phase 2 (Future): Serverless Backend
- 🔜 Student marks lookup (Roll Number based - NO passwords)
- 🔜 Supabase/Firebase integration
- 🔜 Admin panel for content updates
- 🔜 Real-time admission inquiries

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Deployment:** Cloudflare Pages
- **Build:** Static Export (`output: 'export'`)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── schedules/         # Schedules & fees
│   ├── results/           # Results & achievements
│   └── contact/           # Contact & admissions
│
├── components/            # React components
│   ├── layout/           # Header, Footer, Container
│   ├── home/             # Landing page sections
│   ├── schedules/        # Schedule filters & cards
│   ├── results/          # Results display
│   ├── contact/          # Contact forms
│   └── ui/               # Reusable UI components
│
├── data/                  # Static JSON data (PHASE 1)
│   ├── center-info.json  # Center details
│   ├── schedules.json    # Class schedules & fees
│   ├── results.json      # Student results
│   └── testimonials.json # Reviews
│
├── lib/                   # Utilities
│   ├── data-fetchers.ts  # Data loading logic
│   └── types.ts          # TypeScript interfaces
│
└── hooks/                 # Custom React hooks
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm, yarn, or pnpm

### Installation

1. **Clone or navigate to the project folder:**
   ```bash
   cd /Users/dhruv.rawat/Desktop/Dhruv/Matrix/Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

This generates a static site in the `out/` directory.

## 🌐 Cloudflare Pages Deployment

### Method 1: Git-Based Deployment (Recommended)

1. **Push code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages**
   - Click **Create Application** → **Pages** → **Connect to Git**
   - Select your repository

3. **Configure build settings:**
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: out
   Environment variables: (none needed for Phase 1)
   ```

4. **Deploy:**
   - Click **Save and Deploy**
   - Your site will be live at `https://<your-project>.pages.dev`

### Method 2: Direct Upload (Quick Test)

```bash
npm run build
npx wrangler pages deploy out
```

### Custom Domain Setup

1. In Cloudflare Pages dashboard, go to **Custom Domains**
2. Add your domain (e.g., `matrixcoaching.com`)
3. Follow DNS configuration instructions
4. SSL is automatic and free!

## 📝 Content Management

### Updating Data (Non-Developers Friendly!)

All content is in JSON files in `src/data/`. Edit these files to update:

#### 1. Center Information (`center-info.json`)
```json
{
  "name": "Matrix Coaching Center",
  "contact": {
    "phone": "+91-9876543210",
    "email": "info@matrixcoaching.com"
  }
}
```

#### 2. Class Schedules (`schedules.json`)
```json
{
  "classes": [
    {
      "id": "class-10",
      "name": "Class 10th",
      "batches": [...]
    }
  ]
}
```

#### 3. Results (`results.json`)
```json
{
  "academicYears": [
    {
      "year": "2023-2024",
      "toppers": [...]
    }
  ]
}
```

After editing, rebuild and redeploy:
```bash
npm run build
# Then push to GitHub or use wrangler
```

## 🎨 Customization

### Brand Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    500: '#0ea5e9', // Change this!
  }
}
```

### Logo & Images

Place files in `public/images/`:
- `logo.png` - Main logo
- `hero-bg.jpg` - Homepage hero image
- `achievements/` - Student photos

## 🔧 Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Check TypeScript types |

## 🏗️ Architecture Decisions

### Why Static Export?

**✅ Pros:**
- **Free hosting** on Cloudflare Pages
- **Lightning fast** - No server-side rendering overhead
- **Global CDN** - Fast load times across India
- **No downtime** - Static files never crash

**Product Manager Reasoning:**
- For a 1,000-student center, traffic is predictable
- Content updates are infrequent (schedules, results)
- Static site = $0/month vs. $20-50/month for server

### Why Separated Data Layer?

**Current (Phase 1):**
```typescript
import schedules from '@/data/schedules.json';
```

**Future (Phase 2):**
```typescript
const schedules = await fetch('/api/schedules');
```

**Benefit:** When adding backend, only `data-fetchers.ts` changes. All components stay the same!

### Why No Authentication in Phase 2?

**Traditional Login:**
```
Username: student123
Password: ••••••••
```
❌ Complex, requires password reset flows, security overhead

**Our Approach:**
```
Enter Roll Number: MTX2024001
→ Shows marks directly
```
✅ Simple, no passwords to forget, perfect for students

## 📊 Performance Targets

- **Lighthouse Score:** 95+ (All categories)
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Bundle Size:** < 200KB gzipped

## 🐛 Common Issues

### Issue: Build fails with "output: export" error

**Solution:** Make sure you're not using:
- Server-side rendering (`getServerSideProps`)
- API routes in `app/api/`
- Dynamic routes without `generateStaticParams`

### Issue: Images not loading

**Solution:** Use `unoptimized` images:
```tsx
<Image src="/logo.png" alt="Logo" unoptimized />
```

## 📚 Resources

- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

This is a private project for Matrix Coaching Center. For internal team:

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and test locally
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/new-feature`
5. Cloudflare will auto-deploy preview URL

## 📄 License

Proprietary - Matrix Coaching Center, Delhi

## 🙋 Support

For issues or questions:
- **Developer:** Contact tech team
- **Content Updates:** Edit JSON files in `src/data/`
- **Emergency:** Call +91-9876543210

---

**Built with ❤️ for Matrix Academy**
