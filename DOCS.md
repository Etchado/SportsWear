# SportsWear — Technical Documentation

Full reference for architecture, components, contexts, hooks, utilities, and configuration.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Environment Variables](#2-environment-variables)
3. [Design System](#3-design-system)
4. [Routing](#4-routing)
5. [State Management — Context Providers](#5-state-management--context-providers)
6. [Pages](#6-pages)
7. [Layout Components](#7-layout-components)
8. [Section Components](#8-section-components)
9. [UI Components](#9-ui-components)
10. [Custom Hooks](#10-custom-hooks)
11. [Utility Libraries](#11-utility-libraries)
12. [Data Layer](#12-data-layer)
13. [Internationalization (i18n)](#13-internationalization-i18n)
14. [Authentication](#14-authentication)
15. [Features In Detail](#15-features-in-detail)
16. [Performance & SEO](#16-performance--seo)
17. [Security](#17-security)
18. [Deployment](#18-deployment)
19. [Known Limitations & Next Steps](#19-known-limitations--next-steps)

---

## 1. Architecture Overview

```
Browser
  └── React 19 SPA (Vite)
        ├── React Router DOM v7        — client-side routing
        ├── 10 Context Providers       — global state (no Redux)
        ├── Lazy-loaded page chunks    — code splitting per route
        ├── TailwindCSS                — utility-first styling
        ├── Motion (Framer Motion v12) — animations
        └── Supabase JS SDK            — auth + database
              └── Supabase Cloud
                    ├── PostgreSQL     — products, orders, reviews, outfits
                    └── Auth           — email/password, Google, Apple
```

### Provider Tree (App.jsx)

Providers wrap the entire app in this order (outermost → innermost):

```
ThemeProvider
  ToastProvider
    CurrencyProvider
      AuthProvider
        CartProvider
          WishlistProvider
            CompareProvider
              FilterProvider
                LoyaltyProvider
                  ProductsProvider
                    BrowserRouter
                      AppRoutes (Layout + Routes)
```

The order matters: `AuthProvider` must be inside `ToastProvider` so it can fire toast notifications. `ProductsProvider` is innermost because it depends on auth state.

---

## 2. Environment Variables

All variables must be prefixed with `VITE_` to be exposed to the browser bundle at build time.

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | Yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `VITE_ADMIN_EMAIL` | Yes | Email address that gets admin panel access |

Store in `.env.local` locally. On Vercel, add via `vercel env add` or the dashboard under Project Settings → Environment Variables.

> Never commit `.env.local`. It is in `.gitignore`.

---

## 3. Design System

### Color Tokens (`tailwind.config.js`)

```js
colors: {
  brand: {
    pink:  '#FF2D78',   // Primary CTA buttons, badges, active states
    blue:  '#0066FF',   // Compare feature, info highlights
    volt:  '#CCFF00',   // Accent highlights
    black: '#0A0A0A',   // Text, dark elements
  },
  light: {
    bg:      '#FFFFFF',
    surface: '#F8FAFC',
    border:  '#E0E0E0',
    text:    '#0A0A0A',
    muted:   '#718096',
  },
  dark: {
    bg:      '#0A0F1E',
    surface: '#111827',
    border:  '#1F2937',
    text:    '#F9FAFB',
    muted:   '#9CA3AF',
  },
}
```

Always use semantic tokens (`text-light-text`, `bg-dark-surface`) rather than raw hex values in components, so dark mode works automatically.

### Typography

- **English:** Inter (system font stack)
- **Arabic:** Cairo (Google Fonts, loaded in `index.html`)
- Applied via `[dir='rtl']` selector in `index.css`

### Spacing & Shape

| Token | Value | Usage |
|---|---|---|
| `rounded-card` | 12px | Product cards |
| `rounded-modal` | 16px | Modals, drawers |
| `shadow-card` | subtle | Default card shadow |
| `shadow-hover` | stronger | Hover state elevation |

### Dark Mode

Enabled with `darkMode: 'class'` in Tailwind config. The `ThemeContext` toggles the `dark` class on `<html>`. State persists in `localStorage` under the key `sw_theme`.

### RTL Support

Uses Tailwind's logical property variants:
- `ms-*` / `me-*` instead of `ml-*` / `mr-*`
- `ps-*` / `pe-*` instead of `pl-*` / `pr-*`
- `start-*` / `end-*` instead of `left-*` / `right-*`

The `dir` attribute on `<html>` is set by `i18n.js` when the language changes.

---

## 4. Routing

Defined in `src/App.jsx`. All pages are lazy-loaded except `HomePage` (eager, critical path).

```
/                     → HomePage
/auth                 → AuthPage         (redirects to / if already logged in)
/shop                 → ShopPage
/men                  → MenPage
/women                → WomenPage
/kids                 → KidsPage
/sport/:category      → SportPage        (e.g. /sport/running)
/brand/:name          → BrandPage        (e.g. /brand/nike)
/product/:id          → ProductPage      (e.g. /product/00000000-...-001)
/outfit-builder       → OutfitBuilderPage
/drops                → DropsPage
/wishlist             → WishlistPage
/checkout             → CheckoutPage
/account/*            → AccountPage      [RequireAuth]
/size-guide           → SizeGuidePage
/about                → AboutPage
/support/*            → SupportPage      (sub-routes: /faq, /contact, /returns, /track)
/admin                → AdminPage        [RequireAuth]
*                     → NotFoundPage
```

### Protected Routes

`RequireAuth` wrapper (`src/components/layout/RequireAuth.jsx`) checks `useAuth().user`. If null, it redirects to `/auth`. The admin page additionally checks that `user.email === import.meta.env.VITE_ADMIN_EMAIL`.

### Scroll Behavior

`ScrollToTop` component (`src/components/layout/ScrollToTop.jsx`) runs `window.scrollTo({ top: 0, behavior: 'instant' })` on every `pathname` change using `useLocation`.

---

## 5. State Management — Context Providers

### ThemeContext (`src/context/ThemeContext.jsx`)

```js
const { theme, toggleTheme } = useTheme()
// theme: 'light' | 'dark'
```

Persists to `localStorage` key `sw_theme`. Applies/removes `dark` class on `document.documentElement`.

---

### ToastContext (`src/context/ToastContext.jsx`)

```js
const { success, error, info, warning } = useToast()

success('Added to cart')
error('Something went wrong')
info('Please sign in')
warning('Low stock')
```

> API is `toast(message, type)` — positional args, NOT an object.

Toasts auto-dismiss after 3 seconds. Up to 3 visible at once, stacked at top-right.

---

### CurrencyContext (`src/context/CurrencyContext.jsx`)

```js
const { currency, setCurrency, format } = useCurrency()

format(549)   // "549 SAR" | "$150.41" | "€138.73"
```

Supported: `SAR`, `USD`, `EUR`. Conversion rates are hardcoded constants.

---

### AuthContext (`src/context/AuthContext.jsx`)

```js
const { user, loading, signIn, signUp, signOut, signInWithGoogle } = useAuth()
```

Wraps Supabase Auth. `user` is `null` when logged out, or a Supabase `User` object when authenticated. Listens to `onAuthStateChange` for session persistence.

---

### CartContext (`src/context/CartContext.jsx`)

```js
const { items, addItem, removeItem, updateQty, clearCart, openCart, closeCart, isOpen, total, itemCount } = useCart()

addItem(product, color, size, qty)
```

Persisted in `localStorage` key `sw_cart`. `total` is the raw SAR number before tax/shipping.

---

### WishlistContext (`src/context/WishlistContext.jsx`)

```js
const { ids, toggle, isWishlisted } = useWishlist()

toggle(productId)
isWishlisted(productId)  // boolean
```

Stores product IDs only. Persisted in `localStorage` key `sw_wishlist`.

---

### CompareContext (`src/context/CompareContext.jsx`)

```js
const { items, toggle: toggleCompare, isComparing, isFull, remove, clear } = useCompare()
```

Max 3 products. `isFull` is true when 3 items are already in the compare list. Stored in React state only (not persisted).

---

### FilterContext (`src/context/FilterContext.jsx`)

```js
const { filters, setFilter, clearFilters } = useFilter()

// filters shape:
{
  gender: null | 'Men' | 'Women' | 'Kids' | 'Unisex',
  brand: null | string,
  sport: null | string,
  category: null | string,
  sizes: [],
  colors: [],
  priceRange: [0, 2000],
  sort: 'newest' | 'popular' | 'rating' | 'price_asc' | 'price_desc',
}
```

---

### LoyaltyContext (`src/context/LoyaltyContext.jsx`)

```js
const { points, tier, addPoints, redeemPoints, sarToPoints } = useLoyalty()

sarToPoints(549)   // returns point value of a purchase
```

Tiers: Bronze (0–999), Silver (1000–4999), Gold (5000–9999), Platinum (10000+). Persisted to Supabase `loyalty` table when user is authenticated; falls back to `localStorage`.

---

### ProductsContext (`src/context/ProductsContext.jsx`)

```js
const { products, loading, getProduct } = useProducts()

getProduct(id)   // returns Promise<product>
```

Fetches from Supabase `products` table on mount. Falls back to static `src/data/products.js` if Supabase is unavailable or returns empty.

---

## 6. Pages

### HomePage (`src/pages/HomePage.jsx`)

Sections: `HeroBanner` → `FeaturedProducts` → `DropsTeaser` → `BrandGrid`

### ShopPage / MenPage / WomenPage / KidsPage

All render `CatalogLayout` with a pre-applied gender filter. `ShopPage` has no pre-filter.

### SportPage (`/sport/:category`)

Reads `:category` from URL params, pre-filters `CatalogLayout` by sport.

### BrandPage (`/brand/:name`)

Reads `:name`, matches against `product.brand.toLowerCase().replace(' ', '-')`. Pre-filters `CatalogLayout`.

### ProductPage (`/product/:id`)

Key logic:
1. Tries `getProduct(id)` from Supabase
2. Falls back to static data if Supabase fails
3. Redirects to `/404` if product not found

**Out-of-stock handling:**
- If `product.in_stock === false`, the qty stepper and Add to Cart button are replaced with a Notify Me panel (amber card, email input, success state)
- Submit is frontend-only (no DB persistence yet)

**Sub-components used:** `ImageGallery`, `SizePicker`, `ColorPicker`, `ReviewsSection`, `RelatedProducts`

### OutfitBuilderPage (`/outfit-builder`)

Flow:
1. Choose sport (8 options)
2. Choose gender
3. Pick products for 4 slots: Top, Bottom, Shoes, Accessories (via `ProductPickerModal`)
4. Summary bar: thumbnails, total price, Add All to Cart, Save, Share

Saves outfits to:
- `localStorage` (key `sw_outfits`, max 10 items)
- Supabase `outfits` table (fire-and-forget, requires auth)

URL params hydrate the initial sport/gender selection.

### DropsPage (`/drops`)

Displays limited-release products from `products` where `is_drop === true`. Each drop card has:
- Countdown timer (days/hours/minutes/seconds)
- Units remaining bar
- Raffle entry button (frontend-only state)
- Notify Me button for upcoming drops

### CheckoutPage (`/checkout`)

3-step stepper: Cart Review → Shipping Info → Payment

- Cart Review: items, coupon code input, loyalty points redemption, order summary
- Shipping Info: full name, email, phone, address, city, country (Zod-validated)
- Payment: mock payment UI, place order confirmation

### AccountPage (`/account/*`)

Sub-pages via nested routing:
- `/account` → Overview (welcome, stats)
- `/account/orders` → Order history
- `/account/wishlist` → Saved items
- `/account/outfits` → Saved outfits
- `/account/profile` → Edit name/email
- `/account/loyalty` → Points, tier, history

### SizeGuidePage (`/size-guide`)

Features:
- Measurement inputs (height, weight, chest, waist, hips)
- Metric/Imperial toggle
- Recommended size output (uses `src/lib/sizeLogic.js`)
- Clothing chart table
- Shoe size chart (EU/US/UK)
- Print button

### SupportPage (`/support/*`)

Renders one of four panels based on sub-route:
- `/support/faq` — 8 accordion items with AnimatePresence expand/collapse
- `/support/contact` — Info cards + contact form with `sent` success state
- `/support/returns` — 4-step returns process + conditions list
- `/support/track` — Order number input → mock timeline

### AdminPage (`/admin`)

Access: requires auth AND `user.email === VITE_ADMIN_EMAIL`.

Tabs:
- **Stats** — total orders, revenue, reviews (from Supabase)
- **Orders** — all orders table, status update dropdown
- **Reviews** — all reviews, delete button

### AuthPage (`/auth`)

Modes: Sign In, Sign Up, Forgot Password (toggled by local state)

Methods:
- Email + Password
- Continue with Google (`signInWithGoogle`)
- Continue with Apple (UI only, not wired)

---

## 7. Layout Components

### Layout (`src/components/layout/Layout.jsx`)

Master wrapper. Renders in order:
```
ScrollToTop
Navbar
<main>{children}</main>
Footer (unless hideFooter prop)
BottomNav
CartDrawer
CompareBar
CookieBanner
BackToTopButton
WhatsAppButton
```

### Navbar (`src/components/layout/Navbar.jsx`)

- Transparent on scroll top → solid on scroll (uses `useScrolled(10)`)
- Desktop: logo, nav links, search bar, currency switcher, language toggle, theme toggle, wishlist, account, cart
- Mobile: hamburger menu, full-screen slide-down nav

### BottomNav (`src/components/layout/BottomNav.jsx`)

Fixed bottom bar on mobile only (`md:hidden`). Links: Home, Shop, Outfit Builder, Wishlist, Account.

### CartDrawer (`src/components/layout/CartDrawer.jsx`)

Slide-in from end (right in LTR, left in RTL). Shows cart items, quantity controls, subtotal, VAT, shipping, total, checkout button. Backdrop click closes.

### CompareBar (`src/components/layout/CompareBar.jsx`)

Floats above bottom nav when 1–3 products are in compare list. Shows product thumbnails, item count, clear button, and a Compare button that opens `CompareModal` (side-by-side table).

### CookieBanner (`src/components/layout/CookieBanner.jsx`)

Spring-animated banner from bottom. Two choices:
- **Necessary Only** → stores `'necessary'` in `localStorage` key `sw_cookie_choice`
- **Accept All** → stores `'all'`

Hides permanently once a choice is made.

### BackToTopButton (`src/components/layout/BackToTopButton.jsx`)

Appears after scrolling 400px (uses `useScrolled(400)`). Blue circle (`#0066FF`), spring entry animation, smooth scroll to top on click.

### WhatsAppButton (`src/components/layout/WhatsAppButton.jsx`)

Fixed bottom-right (LTR) / bottom-left (RTL) button. Opens `https://wa.me/966500000000?text=...` with a pre-filled translated message. Hover tooltip with AnimatePresence. Appears after 1.2s delay on mount.

### ScrollToTop (`src/components/layout/ScrollToTop.jsx`)

Renderless component. Watches `useLocation().pathname` and fires `window.scrollTo({ top: 0, behavior: 'instant' })` on every route change.

### RequireAuth (`src/components/layout/RequireAuth.jsx`)

HOC-style wrapper. Renders children if `user` is truthy, otherwise navigates to `/auth`.

---

## 8. Section Components

### HeroBanner (`src/components/sections/HeroBanner.jsx`)

Full-viewport hero with:
- Unsplash background image (eager-loaded, `fetchpriority="high"`)
- Animated headline (split by `.` into staggered lines)
- Badge pill, subtitle, two CTA buttons
- Scroll indicator (bouncing line)

Text colors: first line `#2D3748` (dark gray), accent line uses `slide.accent`, subtitle `#1A202C`.

### FeaturedProducts (`src/components/sections/FeaturedProducts.jsx`)

Horizontal scroll row of `ProductCard` components. Filters `products` for items with a badge or high rating.

### DropsTeaser (`src/components/sections/DropsTeaser.jsx`)

Preview of drops page — 2–3 drop cards with live countdowns.

### BrandGrid (`src/components/sections/BrandGrid.jsx`)

Grid of brand logo tiles (Nike, Adidas, Puma, Under Armour, New Balance). Each links to `/brand/:name`.

### CatalogLayout (`src/components/sections/CatalogLayout.jsx`)

The main product listing component used by all catalog pages. Accepts optional `preFilter` prop.

Features:
- `FilterPanel` sidebar (desktop) / bottom sheet (mobile)
- Sort dropdown
- Product grid with `ProductCard`
- Load More button
- Active filter chips

Uses `useFilteredProducts` hook internally.

### ReviewsSection (`src/components/sections/ReviewsSection.jsx`)

Used on `ProductPage`. Displays existing reviews (from Supabase) and a write-review form (star rating + textarea). Requires auth to submit. Optimistically updates the list on submit.

### RelatedProducts (`src/components/sections/RelatedProducts.jsx`)

Horizontal scroll of products with the same sport or category, excluding the current product.

---

## 9. UI Components

### ProductCard (`src/components/ui/ProductCard.jsx`)

Displays a single product in catalog views.

**Out-of-stock state** (`product.in_stock === false`):
- Dark `bg-black/50` overlay over the image
- "Out of Stock" pill badge centered on the overlay
- Quick-add button replaced with amber "🔔 Notify Me" button (links to product page)

**In-stock state:**
- Hover: image scales up, "Add to Cart" bar slides up from bottom
- Top-right: wishlist heart button (always visible), compare button (visible on hover)
- Top-left: badge pill (NEW, SALE, BESTSELLER, EXCLUSIVE), discount % badge

Color swatches in the info section cycle through `product.images` array — each color maps to a different image index.

### FilterPanel (`src/components/ui/FilterPanel.jsx`)

Collapsible filter sections: Gender, Sport, Brand, Category, Size, Color, Price range (slider). Reads/writes to `FilterContext`. Shows active filter count badge.

### Badge (`src/components/ui/Badge.jsx`)

Small label pill. Color varies by `label` value:
- `NEW` → blue
- `SALE` → pink
- `BESTSELLER` → amber
- `EXCLUSIVE` → purple
- `DROP` → volt on black

---

## 10. Custom Hooks

### `useScrolled(threshold)` — `src/hooks/useScrolled.js`

```js
const scrolled = useScrolled(100)   // true when window.scrollY > 100
```

Uses a passive scroll event listener. Threshold defaults to 10.

### `useClickOutside(ref, callback)` — `src/hooks/useClickOutside.js`

```js
const ref = useRef()
useClickOutside(ref, () => setOpen(false))
```

Fires `callback` when a click is detected outside the given `ref`.

### `useFilteredProducts(products, filters)` — `src/hooks/useFilteredProducts.js`

```js
const filtered = useFilteredProducts(allProducts, activeFilters)
```

Pure filtering + sorting logic extracted from `CatalogLayout`. Returns a sorted, filtered array. Memoized with `useMemo`.

### `usePageTitle(title)` — `src/hooks/usePageTitle.js`

```js
usePageTitle('Nike Air Zoom Pegasus 41')
// Sets: <title>Nike Air Zoom Pegasus 41 | SportsWear</title>
// Also updates: <meta property="og:title">
```

---

## 11. Utility Libraries

### `src/lib/supabase.js`

```js
import { supabase } from '@/lib/supabase'
```

Creates and exports a single Supabase client instance using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### `src/lib/i18n.js`

Configures i18next:
- Resources: `en.json`, `ar.json`
- Default language: `en`
- Persists language choice to `localStorage` key `sw_lang`
- Sets `document.documentElement.lang` and `dir` (`rtl` for Arabic)
- Uses `Cairo` font class on `<body>` for Arabic

### `src/lib/currency.js`

```js
import { RATES, SYMBOLS } from '@/lib/currency'
// RATES: { SAR: 1, USD: 0.267, EUR: 0.245 }
// SYMBOLS: { SAR: 'SAR', USD: '$', EUR: '€' }
```

Used by `CurrencyContext` to convert and format prices.

### `src/lib/sizeLogic.js`

```js
import { getRecommendedSize } from '@/lib/sizeLogic'
getRecommendedSize({ height, weight, chest, waist, unit })
// Returns: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL'
```

Used by `SizeGuidePage` to compute the recommended size from body measurements.

### `src/lib/imgFallback.js`

```js
import { handleImgError } from '@/lib/imgFallback'
<img onError={handleImgError} />
```

Sets a grey placeholder SVG when an image fails to load. Prevents broken image icons.

### `src/lib/utils.js`

```js
import { cn } from '@/lib/utils'
cn('px-4', condition && 'bg-pink')
```

Combines `clsx` + `tailwind-merge` for conditional class merging without conflicts.

---

## 12. Data Layer

### Static Data (`src/data/products.js`)

Array of 30 product objects used as a fallback when Supabase is unavailable. Each product has:

```js
{
  id: string,           // UUID format
  title: string,
  brand: string,        // 'Nike' | 'Adidas' | 'Puma' | 'Under Armour' | 'New Balance'
  sport: string,        // 'Running' | 'Football' | 'Basketball' | 'Gym' | 'Yoga' | 'Casual'
  gender: string,       // 'Men' | 'Women' | 'Kids' | 'Unisex'
  category: string,     // 'Shoes' | 'Tops' | 'Bottoms' | 'Jackets'
  price: number,        // SAR
  old_price: number | null,
  colors: string[],
  sizes: string[],
  images: string[],     // Unsplash URLs, one per color variant
  description: string,
  long_description: string,
  specs: object,
  rating: number,       // 0–5
  reviews_count: number,
  badge: 'NEW' | 'SALE' | 'BESTSELLER' | 'EXCLUSIVE' | null,
  is_drop: boolean,
  in_stock: boolean,    // false = out of stock
}
```

### Out-of-Stock Products (examples)

| Product | Category | Reason for OOS |
|---|---|---|
| Nike Air Max 90 | Shoes | Marked `in_stock: false` |
| Nike Strike Football Jersey | Tops | Marked `in_stock: false` |
| Adidas Adizero Running Shorts | Bottoms | Marked `in_stock: false` |
| Adidas Women's Own the Run Jacket | Jackets | Marked `in_stock: false` |

### Supabase Tables (expected schema)

| Table | Key Columns |
|---|---|
| `products` | `id`, `title`, `brand`, `sport`, `gender`, `category`, `price`, `old_price`, `colors`, `sizes`, `images`, `description`, `long_description`, `specs`, `rating`, `reviews_count`, `badge`, `is_drop`, `in_stock` |
| `orders` | `id`, `user_id`, `items`, `total`, `status`, `created_at` |
| `reviews` | `id`, `product_id`, `user_id`, `user_name`, `rating`, `body`, `created_at` |
| `outfits` | `id`, `user_id`, `sport`, `gender`, `slots`, `total`, `created_at` |
| `loyalty` | `id`, `user_id`, `points`, `tier`, `history` |

---

## 13. Internationalization (i18n)

### Language Files

- `src/locales/en.json` — English
- `src/locales/ar.json` — Arabic

### Namespace Structure

```
nav          Navigation links
home         Homepage strings
product      Product detail strings
cart         Cart drawer strings
checkout     Checkout flow strings
auth         Auth page strings
account      Account page strings
drops        Drops page strings
outfit_builder  Outfit builder strings
size_guide   Size guide strings
loyalty      Loyalty program strings
wishlist     Wishlist strings
compare      Compare feature strings
common       Shared UI strings (loading, error, buttons, etc.)
support      Support page strings
admin        Admin panel strings
whatsapp     WhatsApp button tooltip + pre-fill message
brands       Brand display names
sports       Sport display names
filters      Filter label strings
sort         Sort option strings
```

### Usage

```js
const { t, i18n } = useTranslation()

t('product.add_to_cart')
t('cart.free_shipping', { amount: '300 SAR' })   // interpolation
i18n.changeLanguage('ar')                          // switch to Arabic
```

### RTL Switching

When language is set to `ar`, `i18n.js` sets:
```js
document.documentElement.dir = 'rtl'
document.documentElement.lang = 'ar'
document.body.classList.add('font-cairo')
```

---

## 14. Authentication

Handled by Supabase Auth via `AuthContext`.

### Methods Available

| Method | Description |
|---|---|
| `signIn(email, password)` | Email/password sign in |
| `signUp(email, password, displayName)` | Creates account + sends verification email |
| `signOut()` | Clears session |
| `signInWithGoogle()` | OAuth via Google (requires Supabase Google provider configured) |
| `resetPassword(email)` | Sends password reset email |

### Admin Access

The admin panel (`/admin`) checks:
```js
user.email === import.meta.env.VITE_ADMIN_EMAIL
```

This is a simple hardcoded check. For production with multiple admins, use Supabase Row Level Security or a separate `admins` table.

### Session Persistence

Supabase JS SDK handles session persistence in `localStorage` automatically via `onAuthStateChange`.

---

## 15. Features In Detail

### Shopping Cart

- Items stored in `localStorage` key `sw_cart` as an array of `{ product, color, size, qty }`
- Cart drawer (`CartDrawer`) opens automatically when an item is added from `ProductPage`
- Totals calculated in `CartContext`:
  - Subtotal: sum of `price × qty`
  - VAT: 15% of subtotal
  - Shipping: free over 300 SAR, otherwise 25 SAR
  - Total: subtotal + VAT + shipping
- Coupon code field is UI-only (validation logic in `CheckoutPage`)

### Wishlist

- Stores product IDs in `localStorage` key `sw_wishlist`
- Heart button on `ProductCard` and `ProductPage` toggles
- Requires sign-in only for full wishlist page persistence (Supabase sync optional)

### Product Comparison

- Max 3 products at once
- `CompareBar` floats above bottom nav when active
- `CompareModal` renders a table: image, title, price, brand, sport, category, rating
- Cleared on page reload (not persisted)

### Outfit Builder

- 8 sports: Running, Football, Basketball, Gym, Yoga, Swimming, Tennis, Cycling
- 4 genders: Men, Women, Kids, Unisex
- 4 slots: Top, Bottom, Shoes, Accessories
- `ProductPickerModal` shows filtered products with inline search
- "Add Full Outfit to Cart" adds all 4 slots (with default size/color)
- "Save Outfit" saves to localStorage + Supabase `outfits` table
- "Share Outfit" copies a URL with slot IDs as query params

### Loyalty Program

- Earn rate: 1 point per 1 SAR spent
- Redemption: 100 points = 10 SAR discount
- Tiers and required points:
  - Bronze: 0 – 999 pts
  - Silver: 1,000 – 4,999 pts
  - Gold: 5,000 – 9,999 pts
  - Platinum: 10,000+ pts
- Points preview shown on `ProductPage` before purchase
- Points redeemable at checkout step 1

### Out-of-Stock / Notify Me

- Driven by `product.in_stock === false` on the product object
- **ProductCard:** dark overlay + "Out of Stock" badge + amber "Notify Me" button on hover
- **ProductPage:** entire add-to-cart section replaced with an amber Notify Me panel
  - Email input + submit button
  - On submit: shows success message + fires `toast.success`
  - Does not persist to DB currently (frontend-only)

### Cookie Banner

- Shown once on first visit
- Two options: "Necessary Only" or "Accept All"
- Choice stored in `localStorage` key `sw_cookie_choice` as `'necessary'` or `'all'`
- Spring animation from bottom, positioned above bottom nav on mobile

---

## 16. Performance & SEO

### Code Splitting (`vite.config.js`)

Manual chunk configuration:
```js
manualChunks: {
  vendor:   ['react', 'react-dom', 'react-router-dom'],
  supabase: ['@supabase/supabase-js'],
  motion:   ['motion'],
  i18n:     ['i18next', 'react-i18next'],
  zod:      ['zod'],
}
```

All page components are lazy-loaded. Only `HomePage` is eagerly imported (it's the critical path).

### Image Optimization

- `loading="lazy"` on all non-hero images
- `fetchpriority="high"` on hero image
- `preconnect` to `images.unsplash.com` and Google Fonts in `index.html`
- `assetsInlineLimit: 4096` — assets under 4KB inlined as base64

### SEO Files

- `public/robots.txt` — disallows `/admin`, `/account`, `/checkout`
- `public/sitemap.xml` — 21 routes with `<lastmod>` dates
- `public/favicon.svg` — hot-pink "SW" SVG icon

### Meta Tags (`index.html`)

```html
<meta property="og:title" content="SportsWear — Play Hard. Look Harder.">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
```

`usePageTitle` hook updates `document.title` and `og:title` on every page navigation.

---

## 17. Security

Configured in `vercel.json`:

```json
"X-Content-Type-Options": "nosniff"
"X-Frame-Options": "DENY"
"X-XSS-Protection": "1; mode=block"
"Referrer-Policy": "strict-origin-when-cross-origin"
"Permissions-Policy": "camera=(), microphone=(), geolocation=()"
```

Asset caching:
```json
"Cache-Control": "public, max-age=31536000, immutable"
```

Applied to all `/assets/*` files (hashed filenames from Vite).

### Supabase Security

- `VITE_SUPABASE_ANON_KEY` is the public key — safe to expose in the browser
- All sensitive operations should be protected by Supabase Row Level Security (RLS)
- Admin check is client-side only; for stricter enforcement, use a Supabase function or RLS policy

---

## 18. Deployment

### Vercel Configuration

- Project: `etchados-projects/sportswear-store`
- Live alias: `sportswear-st0re.vercel.app`
- GitHub: `https://github.com/Etchado/SportsWear`
- Auto-deploy on push to `main` branch

### Manual Deploy Steps

```bash
# 1. Build and deploy
vercel --prod

# 2. Point alias to new deployment URL
vercel alias set <new-deployment-url> sportswear-st0re.vercel.app
```

### First-Time Setup

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Add env vars (run once per variable)
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_ADMIN_EMAIL production

# Deploy
vercel --prod
```

> Env vars added via `vercel --prod -e VAR=val` only last for that single deployment. Always use `vercel env add` for persistent variables.

---

## 19. Known Limitations & Next Steps

### Not Yet Implemented

| Feature | Notes |
|---|---|
| Search results page | Search bar exists in Navbar but results page is not built |
| Notify Me persistence | Email captured frontend-only, not saved to DB |
| Apple Sign-In | Button exists in AuthPage UI but Supabase provider not wired |
| Real payment gateway | Checkout is a mock; no Stripe/Moyasar integration |
| Filter URL persistence | Filters reset when navigating away |
| Recently Viewed | i18n key `product.recently_viewed` exists but feature not built |
| Product images | Currently using Unsplash lifestyle photos; brand product images would look more authentic |

### Recommended Next Steps

1. **Real product images** — fetch from brand press portals (Nike/Adidas media kits) or use Cloudinary
2. **Search page** — wire `Navbar` search to `/search?q=` route with filtered `CatalogLayout`
3. **Stripe / Moyasar** — connect payment at `CheckoutPage` step 3
4. **Notify Me DB** — save emails to a `notifications` Supabase table
5. **E2E testing** — Playwright tests for cart, auth, checkout flows
6. **Mobile QA** — real device testing, especially RTL Arabic layout
7. **Supabase RLS** — add row-level security policies for orders, reviews, loyalty tables
