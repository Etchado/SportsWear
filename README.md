# SportsWear — Premium Sportswear E-Commerce

A production-ready sportswear store built with React 19, Supabase, and TailwindCSS. Supports English and Arabic (RTL), dark mode, and is deployed on Vercel.

**Live:** [sportswear-st0re.vercel.app](https://sportswear-st0re.vercel.app)

---

## Features

| Feature | Details |
|---|---|
| Product Catalog | Filter by brand, sport, gender, category, size, color, price |
| Product Detail | Image gallery, color/size picker, specs table, reviews |
| Shopping Cart | Slide-out drawer, coupon codes, VAT (15%), free shipping threshold |
| Wishlist | Save products, persisted across sessions |
| Compare | Side-by-side comparison of up to 3 products |
| Outfit Builder | Pick top/bottom/shoes/accessories by sport & gender, save & share |
| Drops Page | Limited releases with countdown timers, raffle entry |
| Loyalty Program | Earn points per SAR spent, tier system (Bronze → Platinum) |
| Out-of-Stock | Dark overlay on card + Notify Me email capture on product page |
| Size Guide | Clothing & shoe charts with metric/imperial toggle and fit finder |
| Auth | Email/password + Google + Apple via Supabase Auth |
| Account | Orders, wishlist, outfits, profile, loyalty points overview |
| Admin Panel | Orders management, reviews, stats (restricted to admin email) |
| Support | FAQ accordion, contact form, returns guide, order tracker |
| Dark Mode | Manual toggle, persisted in localStorage |
| i18n | Full English + Arabic, RTL layout, Cairo font for Arabic |
| Multi-Currency | SAR / USD / EUR with conversion |
| SEO | Sitemap, robots.txt, OG meta tags, per-page document titles |
| Performance | Code splitting, lazy routes, preconnect hints, immutable asset cache |
| Security | CSP headers, X-Frame-Options, XSS protection via vercel.json |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, JSX |
| Routing | React Router DOM v7 |
| Styling | TailwindCSS 3 — class-based dark mode, RTL logical properties |
| Animations | Motion (Framer Motion v12) — `import from 'motion/react'` |
| Backend / Auth | Supabase (PostgreSQL + Auth) |
| Internationalization | i18next + react-i18next |
| Validation | Zod |
| Utilities | clsx, tailwind-merge |
| Build Tool | Vite 6 |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Installation

```bash
git clone https://github.com/Etchado/SportsWear.git
cd SportsWear
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_EMAIL=your@email.com
```

> `.env.local` is in `.gitignore` and is never committed.

### Run Locally

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
SportsWear/
├── public/
│   ├── favicon.svg          # Brand SVG icon
│   ├── robots.txt           # SEO crawler rules
│   ├── sitemap.xml          # 21-route sitemap
│   └── 404.html             # SPA redirect fallback
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, CartDrawer, CookieBanner, etc.
│   │   ├── sections/        # HeroBanner, CatalogLayout, ReviewsSection, etc.
│   │   └── ui/              # ProductCard, FilterPanel, Badge
│   ├── context/             # 10 React Context providers
│   ├── data/
│   │   └── products.js      # Static product data (Supabase fallback)
│   ├── hooks/               # useScrolled, useClickOutside, useFilteredProducts, usePageTitle
│   ├── lib/                 # supabase.js, i18n.js, currency.js, sizeLogic.js, imgFallback.js
│   ├── locales/
│   │   ├── en.json          # English translations
│   │   └── ar.json          # Arabic translations
│   ├── pages/               # 19 route-level page components
│   ├── App.jsx              # Route definitions + full provider tree
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles + Tailwind directives
├── .env.local               # Secret env vars (not committed)
├── vercel.json              # SPA rewrites + security headers + asset caching
├── vite.config.js           # Build config, path alias (@/), code splitting
├── tailwind.config.js       # Design tokens, dark mode, custom colors
├── DOCS.md                  # Full technical documentation
└── README.md                # This file
```

---

## Pages

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — hero, new arrivals, drops teaser, brand grid | No |
| `/shop` | Full catalog with filters and sorting | No |
| `/men` | Men's gender-filtered catalog | No |
| `/women` | Women's gender-filtered catalog | No |
| `/kids` | Kids' gender-filtered catalog | No |
| `/sport/:category` | Sport-specific catalog (running, football, etc.) | No |
| `/brand/:name` | Brand-specific catalog (nike, adidas, etc.) | No |
| `/product/:id` | Product detail — gallery, sizes, colors, reviews | No |
| `/outfit-builder` | Interactive outfit creation tool | No |
| `/drops` | Limited drops with countdowns and raffle | No |
| `/wishlist` | Saved/favorited products | No |
| `/checkout` | 3-step checkout — cart, shipping, payment | No |
| `/account/*` | Dashboard — orders, profile, loyalty, outfits | Yes |
| `/size-guide` | Clothing and shoe size charts | No |
| `/about` | Brand story and values | No |
| `/support/*` | FAQ, contact form, returns, order tracking | No |
| `/admin` | Admin panel — orders, reviews, stats | Yes (admin only) |
| `/auth` | Sign in / sign up | No |

---

## Deployment

The project deploys to Vercel automatically on push to `main`.

To deploy manually:

```bash
npm install -g vercel
vercel --prod
vercel alias set <deployment-url> sportswear-st0re.vercel.app
```

Add environment variables (one-time setup):

```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_ADMIN_EMAIL
```

---

## Brands

Nike · Adidas · Puma · Under Armour · New Balance

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| Brand Pink | `#FF2D78` | Primary CTA, accents |
| Brand Blue | `#0066FF` | Compare, info states |
| Brand Volt | `#CCFF00` | Highlight accents |
| Brand Black | `#0A0A0A` | Text, dark surfaces |
| Light BG | `#FFFFFF` | Page background (light mode) |
| Dark BG | `#0A0F1E` | Page background (dark mode) |
| Dark Surface | `#111827` | Cards/panels (dark mode) |

---

## License

MIT
