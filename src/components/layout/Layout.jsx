import Navbar    from './Navbar'
import Footer    from './Footer'
import BottomNav from './BottomNav'
import CartDrawer from './CartDrawer'

export default function Layout({ children, hideFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <BottomNav />
      <CartDrawer />
    </div>
  )
}
