import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/usePageTitle'

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: 'Are all products authentic?',              a: 'Yes — every item is 100% authentic, sourced directly from official brand distributors. We never sell replicas or unauthorized goods.' },
  { q: 'How long does delivery take?',             a: 'Standard delivery is 2–4 business days. Express same-day delivery is available in Riyadh, Jeddah, and Dammam for orders placed before 2 PM.' },
  { q: 'What is your return policy?',              a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached.' },
  { q: 'How do I track my order?',                 a: 'Once your order ships, you\'ll receive an SMS and email with your tracking number. You can also use the Track Order page under Support.' },
  { q: 'Do you ship internationally?',             a: 'We currently ship within Saudi Arabia and the GCC (UAE, Kuwait, Bahrain, Qatar, Oman). More countries coming soon.' },
  { q: 'Can I exchange for a different size?',     a: 'Absolutely. Initiate a return and place a new order for the correct size. Exchange shipping is free if it\'s a size issue.' },
  { q: 'Are my payment details secure?',           a: 'Yes. All payments are processed through bank-grade encrypted connections. We never store your card details.' },
  { q: 'How do loyalty points work?',              a: 'You earn 1 point for every 1 SAR spent. 100 points = 10 SAR discount at checkout. Points never expire.' },
]

function FAQItem({ item, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-light-border dark:border-dark-border">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between py-5 text-start gap-4"
      >
        <span className="font-bold text-light-text dark:text-dark-text">{item.q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-lg font-light"
          style={{ background: open ? '#FF2D78' : '#718096' }}
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-light-muted dark:text-dark-muted leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQPage() {
  usePageTitle('FAQ')
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-black text-light-text dark:text-dark-text mb-2">Frequently Asked Questions</h1>
      <p className="text-light-muted dark:text-dark-muted mb-10">Everything you need to know about SportsWear.</p>
      <div>
        {FAQ_ITEMS.map((item, i) => <FAQItem key={i} item={item} index={i} />)}
      </div>
      <div className="mt-10 p-6 rounded-2xl bg-light-surface dark:bg-dark-surface text-center">
        <p className="font-bold text-light-text dark:text-dark-text mb-2">Still have questions?</p>
        <p className="text-sm text-light-muted dark:text-dark-muted mb-4">Our team is available 7 days a week.</p>
        <Link to="/support/contact" className="inline-block px-6 py-2.5 rounded-xl font-black text-sm text-white" style={{ background: '#FF2D78' }}>
          Contact Us
        </Link>
      </div>
    </div>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactPage() {
  usePageTitle('Contact Us')
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-black text-light-text dark:text-dark-text mb-2">Contact Us</h1>
      <p className="text-light-muted dark:text-dark-muted mb-10">We're here to help — reach out any time.</p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Info */}
        <div className="space-y-5">
          {[
            { icon: '📍', label: 'Address',       value: 'King Fahd Road, Riyadh, Saudi Arabia' },
            { icon: '📞', label: 'Phone',          value: '+966 50 000 0000' },
            { icon: '📧', label: 'Email',          value: 'support@sportswear.sa' },
            { icon: '🕐', label: 'Working Hours',  value: 'Sat–Thu, 9 AM – 10 PM' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex gap-4 items-start p-4 rounded-2xl bg-light-surface dark:bg-dark-surface">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-light-muted dark:text-dark-muted">{label}</p>
                <p className="font-semibold text-light-text dark:text-dark-text mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 rounded-2xl bg-light-surface dark:bg-dark-surface text-center"
          >
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-xl font-black text-light-text dark:text-dark-text mb-2">Message Sent!</h3>
            <p className="text-light-muted dark:text-dark-muted text-sm">We'll get back to you within 24 hours.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name',    label: 'Full Name',    type: 'text' },
              { key: 'email',   label: 'Email',        type: 'email' },
              { key: 'subject', label: 'Subject',      type: 'text' },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-bold text-light-muted dark:text-dark-muted uppercase tracking-wide mb-1.5">{label}</label>
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-sm text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-bold text-light-muted dark:text-dark-muted uppercase tracking-wide mb-1.5">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-sm text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-black text-sm text-white hover:opacity-90 transition-opacity"
              style={{ background: '#FF2D78' }}
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

// ─── Returns ─────────────────────────────────────────────────────────────────
function ReturnsPage() {
  usePageTitle('Returns & Exchanges')
  const steps = [
    { n: '01', title: 'Initiate Return',    desc: 'Log into your account, go to My Orders, and select the item you want to return. Choose a reason and submit.' },
    { n: '02', title: 'Pack Your Item',     desc: 'Place the item in its original packaging with all tags attached. Include your order number inside the package.' },
    { n: '03', title: 'Schedule Pickup',    desc: 'We\'ll arrange a free pickup from your address within 1–2 business days after your return is approved.' },
    { n: '04', title: 'Get Your Refund',    desc: 'Refund is processed within 3–5 business days after we receive and inspect the item.' },
  ]
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-black text-light-text dark:text-dark-text mb-2">Returns & Exchanges</h1>
      <p className="text-light-muted dark:text-dark-muted mb-10">30-day hassle-free returns on all items.</p>

      <div className="space-y-4 mb-12">
        {steps.map(({ n, title, desc }) => (
          <div key={n} className="flex gap-5 p-5 rounded-2xl bg-light-surface dark:bg-dark-surface">
            <span className="text-2xl font-black shrink-0" style={{ color: '#FF2D78' }}>{n}</span>
            <div>
              <h3 className="font-black text-light-text dark:text-dark-text mb-1">{title}</h3>
              <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl p-6 border-2 border-light-border dark:border-dark-border space-y-3">
        <h3 className="font-black text-light-text dark:text-dark-text">Return Conditions</h3>
        {[
          '✅ Items must be returned within 30 days of delivery',
          '✅ Must be unworn, unwashed, and in original condition',
          '✅ Original tags must be attached',
          '✅ Original packaging required',
          '❌ Sale items marked "Final Sale" are not eligible',
          '❌ Underwear and swimwear cannot be returned for hygiene reasons',
        ].map(c => (
          <p key={c} className="text-sm text-light-muted dark:text-dark-muted">{c}</p>
        ))}
      </div>
    </div>
  )
}

// ─── Track Order ──────────────────────────────────────────────────────────────
function TrackOrderPage() {
  usePageTitle('Track Order')
  const [orderId, setOrderId] = useState('')
  const [result, setResult] = useState(null)

  function handleTrack(e) {
    e.preventDefault()
    // Mock result — in production this would call a real API
    setResult({
      id: orderId,
      status: 'In Transit',
      eta: 'Tomorrow, before 9 PM',
      steps: [
        { label: 'Order Placed',    done: true,  time: '2 days ago' },
        { label: 'Processing',      done: true,  time: 'Yesterday' },
        { label: 'Shipped',         done: true,  time: 'Today, 9:00 AM' },
        { label: 'Out for Delivery', done: false, time: 'Tomorrow' },
        { label: 'Delivered',       done: false,  time: '' },
      ],
    })
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-black text-light-text dark:text-dark-text mb-2">Track Your Order</h1>
      <p className="text-light-muted dark:text-dark-muted mb-8">Enter your order number to see the latest status.</p>

      <form onSubmit={handleTrack} className="flex gap-2 mb-8">
        <input
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          placeholder="e.g. ORD-ABC123"
          required
          className="flex-1 px-4 py-3 rounded-xl bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border text-sm text-light-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-black text-sm text-white hover:opacity-90 transition-opacity"
          style={{ background: '#FF2D78' }}
        >
          Track
        </button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-light-surface dark:bg-dark-surface p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-light-muted dark:text-dark-muted font-bold uppercase tracking-wide">Order</p>
                <p className="font-black text-light-text dark:text-dark-text">{result.id}</p>
              </div>
              <div className="text-end">
                <p className="text-xs text-light-muted dark:text-dark-muted font-bold uppercase tracking-wide">Estimated Delivery</p>
                <p className="font-black text-light-text dark:text-dark-text">{result.eta}</p>
              </div>
            </div>

            <div className="space-y-4">
              {result.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 ${step.done ? 'text-white' : 'bg-light-border dark:bg-dark-border text-light-muted dark:text-dark-muted'}`}
                    style={step.done ? { background: '#FF2D78' } : {}}
                  >
                    {step.done ? '✓' : '○'}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${step.done ? 'text-light-text dark:text-dark-text' : 'text-light-muted dark:text-dark-muted'}`}>
                      {step.label}
                    </p>
                    {step.time && <p className="text-xs text-light-muted dark:text-dark-muted">{step.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Layout wrapper with side nav ─────────────────────────────────────────────
const NAV_LINKS = [
  { to: '/support/faq',     label: 'FAQ',                  icon: '❓' },
  { to: '/support/contact', label: 'Contact Us',           icon: '💬' },
  { to: '/support/returns', label: 'Returns & Exchanges',  icon: '🔄' },
  { to: '/support/track',   label: 'Track Order',          icon: '📦' },
]

export default function SupportPage() {
  const location = useLocation()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <p className="text-xs font-black uppercase tracking-widest text-light-muted dark:text-dark-muted mb-3 px-3">Support</p>
          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
            {NAV_LINKS.map(({ to, label, icon }) => {
              const active = location.pathname === to || (location.pathname === '/support' && to === '/support/faq')
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'text-white'
                      : 'text-light-muted dark:text-dark-muted hover:bg-light-surface dark:hover:bg-dark-surface hover:text-light-text dark:hover:text-dark-text'
                  }`}
                  style={active ? { background: '#FF2D78' } : {}}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <Routes>
            <Route index          element={<FAQPage />} />
            <Route path="faq"     element={<FAQPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="returns" element={<ReturnsPage />} />
            <Route path="track"   element={<TrackOrderPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
