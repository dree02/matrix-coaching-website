# Cloudflare Pages Deployment Guide

## 🎯 Overview

This guide walks you through deploying the Matrix Coaching Center website to Cloudflare Pages for **completely free hosting** with global CDN.

## 📋 Prerequisites Checklist

- [ ] GitHub account ([Sign up](https://github.com/join))
- [ ] Cloudflare account ([Sign up](https://dash.cloudflare.com/sign-up))
- [ ] Project code pushed to GitHub repository
- [ ] Project builds successfully (`npm run build` works locally)

## 🚀 Step-by-Step Deployment

### Step 1: Verify Local Build

Before deploying, ensure your project builds correctly:

```bash
# Navigate to project directory
cd /Users/dhruv.rawat/Desktop/Dhruv/Matrix/Website

# Install dependencies
npm install

# Test build
npm run build
```

**Expected Output:**
```
✓ Generating static pages
✓ Finalizing page optimization
✓ Export successful!
```

The `out/` directory should contain your static site.

### Step 2: Push to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Matrix Coaching Center website"

# Create GitHub repository at https://github.com/new
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/matrix-coaching.git
git branch -M main
git push -u origin main
```

### Step 3: Connect Cloudflare Pages

1. **Login to Cloudflare:**
   - Visit [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
   - Login or create account (free tier is sufficient)

2. **Navigate to Pages:**
   - Click **Workers & Pages** in left sidebar
   - Click **Create Application** button
   - Select **Pages** tab
   - Click **Connect to Git**

3. **Authorize GitHub:**
   - Click **Connect GitHub**
   - Authorize Cloudflare Pages app
   - Select **All repositories** or specific repository

4. **Select Repository:**
   - Choose your `matrix-coaching` repository
   - Click **Begin setup**

### Step 4: Configure Build Settings

**Framework Preset:** Next.js (Static Export)

**Build Configuration:**
```
Build command:       npm run build
Build output dir:    out
Root directory:      /
Node version:        18 or higher
```

**Environment Variables (Phase 1):**
```
(None required for Phase 1)
```

**Advanced Build Settings:**
```
✓ Enable automatic deployments (main branch)
✓ Enable preview deployments (pull requests)
```

### Step 5: Deploy!

1. Click **Save and Deploy**
2. Watch the build logs in real-time
3. First deployment takes 2-3 minutes
4. ✅ Success! Your site is live

**Your URL:**
```
https://matrix-coaching.pages.dev
```

Or custom:
```
https://YOUR_PROJECT_NAME.pages.dev
```

## 🌐 Custom Domain Setup (Optional)

### If You Own a Domain (e.g., matrixcoaching.com)

1. **In Cloudflare Pages Dashboard:**
   - Go to your project
   - Click **Custom Domains** tab
   - Click **Set up a custom domain**

2. **Add Your Domain:**
   ```
   matrixcoaching.com
   www.matrixcoaching.com
   ```

3. **Configure DNS:**

   **Option A: Domain on Cloudflare (Easiest)**
   - Cloudflare auto-configures DNS
   - SSL certificate auto-issued (free)
   - Done! ✅

   **Option B: Domain elsewhere**
   - Add CNAME record:
     ```
     CNAME  @  matrix-coaching.pages.dev
     CNAME  www  matrix-coaching.pages.dev
     ```
   - Wait 5-10 minutes for DNS propagation

## 🔄 Automatic Deployments

### How It Works

Every time you push to GitHub:

1. **Main Branch Push:**
   ```bash
   git add .
   git commit -m "Update schedules"
   git push origin main
   ```
   → Automatically deploys to production
   → Live at `matrixcoaching.com`

2. **Pull Request:**
   ```bash
   git checkout -b feature/new-page
   # Make changes
   git push origin feature/new-page
   # Create PR on GitHub
   ```
   → Creates preview deployment
   → Get unique URL like: `https://abc123.matrix-coaching.pages.dev`
   → Test before merging!

### Deployment Time

- **Build Time:** 1-2 minutes
- **Global Propagation:** 30 seconds
- **Total:** ~2-3 minutes from push to live

## 📊 Monitoring & Analytics

### View Deployment Status

1. Go to Cloudflare Pages dashboard
2. Click your project
3. See **Deployment History:**
   - ✅ Success
   - ⏳ In Progress
   - ❌ Failed (view logs)

### Enable Cloudflare Web Analytics (Free!)

1. In project dashboard → **Analytics** tab
2. Click **Enable Web Analytics**
3. Get insights:
   - Page views
   - Unique visitors
   - Top pages
   - Load times
   - Geographic distribution

No code changes needed - automatic!

## 🐛 Troubleshooting

### Build Fails: "Module not found"

**Cause:** Dependencies not installed

**Fix:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build

# If successful, push package-lock.json
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Build Fails: "Output directory not found"

**Cause:** Wrong output directory in Cloudflare settings

**Fix:**
- Go to Cloudflare Pages → Project → **Settings**
- **Build settings** → Build output directory: `out`
- Retry deployment

### Site Shows 404 on Refresh

**Cause:** Missing `_redirects` file for client-side routing

**Fix:** Create `public/_redirects`:
```
/*    /index.html   200
```

Rebuild and deploy.

### Images Not Loading

**Cause:** Image paths incorrect

**Fix:**
```tsx
// ❌ Wrong
<img src="/public/logo.png" />

// ✅ Correct
<img src="/logo.png" />
```

Public files are served from root.

## 🔐 Security & Performance

### Automatic Features (Free!)

- ✅ **Free SSL Certificate** (HTTPS)
- ✅ **DDoS Protection**
- ✅ **Global CDN** (260+ cities)
- ✅ **Brotli Compression**
- ✅ **HTTP/3 Support**
- ✅ **Automatic Minification**

### Performance Optimization Tips

1. **Optimize Images:**
   ```bash
   # Before uploading, compress images
   # Use tools like TinyPNG or ImageOptim
   ```

2. **Enable Cloudflare Features:**
   - Go to **Speed** → **Optimization**
   - Enable **Auto Minify** (HTML, CSS, JS)
   - Enable **Brotli**

3. **Use Cloudflare Analytics:**
   - Monitor Core Web Vitals
   - Identify slow pages

## 💰 Cost Breakdown

### Cloudflare Pages (Free Tier)

- ✅ Unlimited sites
- ✅ Unlimited bandwidth
- ✅ 500 builds/month
- ✅ 1 concurrent build
- ✅ Free SSL
- ✅ Global CDN

**Cost: $0/month** 🎉

### Upgrade Needed If:

- More than 500 deployments/month ($20/month)
- Need faster builds ($20/month for 5 concurrent)
- Advanced features (geo-routing, A/B testing)

**For a 1,000-student center:** Free tier is MORE than enough!

## 🎯 Post-Deployment Checklist

- [ ] Site loads at production URL
- [ ] All pages accessible (Home, Schedules, Results, Contact)
- [ ] Images load correctly
- [ ] Forms work (WhatsApp redirects)
- [ ] Mobile responsive
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Check Lighthouse score (aim for 90+)
- [ ] Share URL with team for feedback

## 📞 Next Steps

### Phase 1 Complete! 🎉

**Now you can:**
1. Share site with stakeholders
2. Collect feedback
3. Update content via JSON files
4. Monitor analytics

### Phase 2 Planning

When ready to add backend:
1. Set up Supabase/Firebase
2. Add API routes (will use Cloudflare Workers)
3. Update `data-fetchers.ts` only
4. No changes to components needed!

## 🆘 Need Help?

- **Build Issues:** Check [Cloudflare Docs](https://developers.cloudflare.com/pages/)
- **Next.js Issues:** [Next.js Docs](https://nextjs.org/docs)
- **Emergency:** Contact project developer

---

**Your site is now live and globally distributed! 🚀**
