# MED SHOP - Luxury E-Commerce Platform (Morocco)

A luxury e-commerce web application for bags, fine jewelry, luxury watches, and leather goods tailored for the Moroccan market with bilingual support (Français / العربية), Cash-on-Delivery (COD) & WhatsApp checkout, embedded CMS, and real-time order management.

---

## Architecture & Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router, Turbopack, Server Actions, Server Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Lucide Icons and custom luxury gold palette (`#D4AF37`)
- **CMS (Catalog & Media)**: [Sanity.io](https://www.sanity.io/) Studio v3 embedded directly at `/studio`
- **Database (Orders & Customers)**: [Supabase](https://supabase.com/) PostgreSQL with Row Level Security (RLS)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) toast system
- **Hosting**: [Vercel](https://vercel.com/)

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Start local development server
cmd /c npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 1. Supabase Setup (Database & Order Management)

The platform logs every customer order into Supabase before launching the customer's WhatsApp checkout message.

### Steps:
1. Go to [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and name it (e.g. `med-shop-db`).
3. In the Supabase left sidebar, click **SQL Editor** -> **New Query**.
4. Open the file [`supabase/schema.sql`](./supabase/schema.sql) in this repository, copy its entire contents, paste them into the query editor, and click **Run**.
   - This creates the `orders` table, `products` table, indexes, and security policies.
5. In Supabase, go to **Project Settings** (gear icon) -> **API**:
   - Copy **Project URL** -> Set as `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`.
   - Copy **Project API Keys** -> `anon` / `public` -> Set as `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Copy **Project API Keys** -> `service_role` (secret) -> Set as `SUPABASE_SERVICE_ROLE_KEY`.

---

## 2. Sanity.io Setup (CMS & Product Catalog)

Sanity Studio is built into this repository at `/studio`. You can manage categories, images, prices, stock, and descriptions in both French and Arabic.

### Steps:
1. Go to [sanity.io](https://www.sanity.io) and create a free account or sign in.
2. Go to [sanity.io/manage](https://www.sanity.io/manage) and click **Create Project** (e.g. `med-shop-cms`).
3. Select the **Production** dataset (default).
4. Copy your **Project ID** from the project dashboard.
5. In `.env.local`, set:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   ```
6. In your Sanity project settings on `sanity.io/manage`:
   - Go to **API** -> **CORS Origins**.
   - Add `http://localhost:3000` (allow credentials = Yes).
   - Once deployed on Vercel, also add `https://your-domain.vercel.app`.
7. Navigate to [http://localhost:3000/studio](http://localhost:3000/studio) to access your Sanity Studio CMS and publish products.

---

## 3. Admin Dashboard (`/admin`)

Manage incoming orders in real time:
- URL: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Default Passcode**: `medshop2026` (configure in `.env.local` via `ADMIN_PASSCODE`).
- **Features**:
  - Live revenue metrics & KPIs (Total Orders, Pending Orders, Delivered).
  - Search by customer name, phone number, or city.
  - One-click **WhatsApp Direct Chat** with pre-filled order status updates.
  - One-click **Direct Phone Call** (`tel:+212...`).
  - Order status switcher (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`).

---

## 4. Vercel Hosting Deployment

Deploy the store to Vercel in less than 3 minutes:

### Step 1: Push Code to GitHub
```bash
git remote add origin https://github.com/<your-username>/med-shop.git
git branch -M main
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [vercel.com](https://vercel.com) and click **Add New** -> **Project**.
2. Select your `med-shop` GitHub repository.
3. Framework Preset: **Next.js** (detected automatically).
4. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_SITE_URL`: `https://your-domain.vercel.app` (or custom domain)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: `2126XXXXXXXX` (your Moroccan business WhatsApp number without `+`)
   - `ADMIN_PASSCODE`: Your custom admin passcode
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity Project ID
   - `NEXT_PUBLIC_SANITY_DATASET`: `production`
   - `NEXT_PUBLIC_SANITY_API_VERSION`: `2024-01-01`
5. Click **Deploy**.
6. Once deployed, add your Vercel URL to Sanity's CORS origins at [sanity.io/manage](https://www.sanity.io/manage) -> **API** -> **CORS origins**.
