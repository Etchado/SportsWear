import Navbar          from './Navbar'
import Footer          from './Footer'
import BottomNav       from './BottomNav'
import CartDrawer      from './CartDrawer'
import ScrollToTop     from './ScrollToTop'
import CompareBar      from './CompareBar'
import CookieBanner    from './CookieBanner'
import BackToTopButton from './BackToTopButton'
import WhatsAppButton  from './WhatsAppButton'

export default function Layout({ children, hideFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <BottomNav />
      <CartDrawer />
      <CompareBar />
      <CookieBanner />
      <BackToTopButton />
      <WhatsAppButton />
    </div>
  )
}
