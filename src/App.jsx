import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { useAuth } from '@/context/AuthContext'

// Providers
import { ThemeProvider }      from '@/context/ThemeContext'
import { ToastProvider }      from '@/context/ToastContext'
import { CurrencyProvider }   from '@/context/CurrencyContext'
import { AuthProvider }       from '@/context/AuthContext'
import { CartProvider }       from '@/context/CartContext'
import { WishlistProvider }   from '@/context/WishlistContext'
import { CompareProvider }    from '@/context/CompareContext'
import { FilterProvider }     from '@/context/FilterContext'
import { LoyaltyProvider }    from '@/context/LoyaltyContext'
import { ProductsProvider }   from '@/context/ProductsContext'
import { QuickViewProvider }  from '@/context/QuickViewContext'

// Layout
import Layout        from '@/components/layout/Layout'
import RequireAuth   from '@/components/layout/RequireAuth'

// Global UI
import ScrollProgressBar from '@/components/ui/ScrollProgressBar'
import CookieBanner      from '@/components/ui/CookieBanner'
import QuickViewModal    from '@/components/ui/QuickViewModal'

// Eager page
import HomePage from '@/pages/HomePage'

// Lazy pages
const AuthPage          = lazy(() => import('@/pages/AuthPage'))
const ShopPage          = lazy(() => import('@/pages/ShopPage'))
const MenPage           = lazy(() => import('@/pages/MenPage'))
const WomenPage         = lazy(() => import('@/pages/WomenPage'))
const KidsPage          = lazy(() => import('@/pages/KidsPage'))
const SportPage         = lazy(() => import('@/pages/SportPage'))
const BrandPage         = lazy(() => import('@/pages/BrandPage'))
const ProductPage       = lazy(() => import('@/pages/ProductPage'))
const OutfitBuilderPage = lazy(() => import('@/pages/OutfitBuilderPage'))
const DropsPage         = lazy(() => import('@/pages/DropsPage'))
const WishlistPage      = lazy(() => import('@/pages/WishlistPage'))
const CheckoutPage      = lazy(() => import('@/pages/CheckoutPage'))
const AccountPage       = lazy(() => import('@/pages/AccountPage'))
const SizeGuidePage     = lazy(() => import('@/pages/SizeGuidePage'))
const AboutPage         = lazy(() => import('@/pages/AboutPage'))
const SupportPage       = lazy(() => import('@/pages/SupportPage'))
const AdminPage         = lazy(() => import('@/pages/AdminPage'))
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: '#FF2D78', borderTopColor: 'transparent' }}
      />
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Layout>
      <ScrollProgressBar />
      <CookieBanner />
      <QuickViewModal />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"                element={<HomePage />} />
          <Route path="/auth"            element={user ? <Navigate to="/" replace /> : <AuthPage />} />
          <Route path="/shop"            element={<ShopPage />} />
          <Route path="/men"             element={<MenPage />} />
          <Route path="/women"           element={<WomenPage />} />
          <Route path="/kids"            element={<KidsPage />} />
          <Route path="/sport/:category" element={<SportPage />} />
          <Route path="/brand/:name"     element={<BrandPage />} />
          <Route path="/product/:id"     element={<ProductPage />} />
          <Route path="/outfit-builder"  element={<OutfitBuilderPage />} />
          <Route path="/drops"           element={<DropsPage />} />
          <Route path="/wishlist"        element={<WishlistPage />} />
          <Route path="/checkout"        element={<CheckoutPage />} />
          <Route path="/account/*"       element={<RequireAuth><AccountPage /></RequireAuth>} />
          <Route path="/size-guide"      element={<SizeGuidePage />} />
          <Route path="/about"           element={<AboutPage />} />
          <Route path="/support/*"       element={<SupportPage />} />
          <Route path="/admin"           element={<RequireAuth><AdminPage /></RequireAuth>} />
          <Route path="*"               element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <CurrencyProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <CompareProvider>
                    <FilterProvider>
                      <LoyaltyProvider>
                        <ProductsProvider>
                          <QuickViewProvider>
                            <AppRoutes />
                          </QuickViewProvider>
                        </ProductsProvider>
                      </LoyaltyProvider>
                    </FilterProvider>
                  </CompareProvider>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </CurrencyProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
