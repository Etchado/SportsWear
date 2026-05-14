import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { useCurrency } from '@/context/CurrencyContext'
import { useLoyalty } from '@/context/LoyaltyContext'
import { useToast } from '@/context/ToastContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { handleImgError } from '@/lib/imgFallback'
import { supabase } from '@/lib/supabase'
import { COUPONS } from '@/data/products'

// ─── Zod schema ──────────────────────────────────────────────────────────────
const shippingSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  email:     z.string().email('Invalid email address'),
  phone:     z.string().min(7, 'Phone number is required'),
  address:   z.string().min(5, 'Street address is required'),
  city:      z.string().min(2, 'City is required'),
  country:   z.string().min(2, 'Country is required'),
})

// ─── Step indicator ──────────────────────────────────────────────────────────
function StepBar({ step }) {
  const { t } = useTranslation()
  const steps = [t('checkout.step_cart'), t('checkout.step_shipping'), t('checkout.step_payment')]
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => {
        const idx = i + 1
        const done    = step > idx
        const current = step === idx
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                  done    ? 'bg-brand-pink text-white' :
                  current ? 'bg-brand-pink text-white ring-4 ring-brand-pink/20' :
                            'bg-light-surface dark:bg-dark-surface text-light-muted dark:text-dark-muted'
                }`}
              >
                {done ? '✓' : idx}
              </div>
              <span className={`mt-1 text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${current ? 'text-brand-pink' : 'text-light-muted dark:text-dark-muted'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-4 transition-colors ${step > idx ? 'bg-brand-pink' : 'bg-light-border dark:bg-dark-border'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Order summary sidebar ────────────────────────────────────────────────────
function OrderSummary({ items, subtotal, discount, coupon, redeemed, shipping, vat, total }) {
  const { t } = useTranslation()
  const { format } = useCurrency()
  const FREE_SHIPPING_THRESHOLD = 300

  const rows = [
    { label: t('cart.subtotal'),  val: subtotal },
    coupon   && { label: `${t('cart.coupon')} (${coupon})`, val: -discount, pink: true },
    redeemed && { label: t('checkout.redeem_points'),        val: -redeemed, pink: true },
    { label: t('cart.shipping'), val: shipping === 0 ? t('common.free_shipping_label') : format(shipping) },
    { label: t('cart.vat'),      val: vat },
  ].filter(Boolean)

  return (
    <div className="rounded-2xl bg-light-surface dark:bg-dark-surface p-5 sticky top-24">
      <h3 className="font-black text-light-text dark:text-dark-text mb-4">{t('checkout.order_summary') ?? 'Order Summary'}</h3>

      {/* Mini item list */}
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {items.map(item => (
          <div key={`${item.productId}__${item.color}__${item.size}`} className="flex gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-700">
              <img src={item.image} alt={item.title} onError={handleImgError} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-light-text dark:text-dark-text line-clamp-1">{item.title}</p>
              <p className="text-[10px] text-light-muted dark:text-dark-muted">{item.color} · {item.size} · ×{item.qty}</p>
            </div>
            <p className="text-xs font-black text-light-text dark:text-dark-text flex-shrink-0">{format(item.price * item.qty)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-light-border dark:border-dark-border pt-4 space-y-2">
        {rows.map(({ label, val, pink }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-light-muted dark:text-dark-muted">{label}</span>
            <span className={`font-black ${pink ? 'text-brand-pink' : 'text-light-text dark:text-dark-text'}`}>
              {typeof val === 'number' ? (val < 0 ? `-${format(Math.abs(val))}` : format(val)) : val}
            </span>
          </div>
        ))}
        <div className="border-t border-light-border dark:border-dark-border pt-2 flex justify-between">
          <span className="font-black text-light-text dark:text-dark-text">{t('cart.total')}</span>
          <span className="text-xl font-black text-light-text dark:text-dark-text">{format(total)}</span>
        </div>
      </div>

      {subtotal < FREE_SHIPPING_THRESHOLD && (
        <p className="mt-3 text-xs text-light-muted dark:text-dark-muted text-center">
          {t('cart.free_shipping', { amount: format(FREE_SHIPPING_THRESHOLD) })}
        </p>
      )}
    </div>
  )
}

// ─── Step 1: Cart Review ─────────────────────────────────────────────────────
function CartReview({ coupon, setCoupon, couponInput, setCouponInput, redeemed, setRedeemed, onNext }) {
  const { t } = useTranslation()
  const { items, removeItem, updateQty, subtotal } = useCart()
  const { format } = useCurrency()
  const { points, pointsToSAR } = useLoyalty()
  const { toast } = useToast()
  const [couponError, setCouponError] = useState('')

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase()
    const c = COUPONS[code]
    if (!c) { setCouponError(t('checkout.invalid_coupon') ?? 'Invalid coupon code'); return }
    setCoupon({ code, ...c })
    setCouponError('')
    toast.success(`${c.label} applied!`)
  }

  function togglePoints() {
    if (redeemed > 0) { setRedeemed(0); return }
    const maxRedeem = Math.min(points, Math.floor(subtotal)) // can't redeem more than subtotal
    setRedeemed(pointsToSAR(maxRedeem))
    toast.info(`${maxRedeem} pts → ${format(pointsToSAR(maxRedeem))} discount applied`)
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">🛒</p>
        <p className="text-xl font-black text-light-text dark:text-dark-text mb-2">{t('cart.empty')}</p>
        <Link to="/shop" className="inline-flex mt-4 px-8 py-3 rounded-xl font-black text-sm text-white" style={{ background: '#FF2D78' }}>
          {t('nav.shop')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Cart items */}
      {items.map(item => (
        <div key={`${item.productId}__${item.color}__${item.size}`}
          className="flex gap-4 p-4 rounded-2xl bg-light-surface dark:bg-dark-surface"
        >
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-700">
            <img src={item.image} alt={item.title} onError={handleImgError} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm text-light-text dark:text-dark-text line-clamp-1">{item.title}</p>
            <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5">{item.color} · {item.size}</p>
            <p className="text-sm font-black mt-1" style={{ color: '#FF2D78' }}>{format(item.price)}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button type="button" onClick={() => removeItem(item.productId, item.color, item.size)}
              className="text-xs text-light-muted dark:text-dark-muted hover:text-red-500 transition-colors"
            >
              {t('cart.remove')}
            </button>
            <div className="flex items-center border border-light-border dark:border-dark-border rounded-xl overflow-hidden">
              <button type="button" disabled={item.qty <= 1}
                onClick={() => updateQty(item.productId, item.color, item.size, item.qty - 1)}
                className="px-2.5 py-1 font-black text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg disabled:opacity-30 text-sm"
              >−</button>
              <span className="px-3 text-sm font-black text-light-text dark:text-dark-text tabular-nums">{item.qty}</span>
              <button type="button"
                onClick={() => updateQty(item.productId, item.color, item.size, item.qty + 1)}
                className="px-2.5 py-1 font-black text-light-text dark:text-dark-text hover:bg-light-bg dark:hover:bg-dark-bg text-sm"
              >+</button>
            </div>
          </div>
        </div>
      ))}

      {/* Coupon */}
      <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border">
        <p className="text-sm font-black text-light-text dark:text-dark-text mb-3">{t('checkout.coupon') ?? 'Coupon Code'}</p>
        {coupon ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-brand-pink">✓ {coupon.code} — {coupon.label}</span>
            <button type="button" onClick={() => setCoupon(null)} className="text-xs text-light-muted dark:text-dark-muted hover:text-red-500">✕</button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              value={couponInput}
              onChange={e => setCouponInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyCoupon()}
              placeholder={t('cart.coupon_placeholder')}
              className="flex-1 border border-light-border dark:border-dark-border bg-transparent rounded-xl px-4 py-2.5 text-sm text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-brand-pink"
            />
            <button type="button" onClick={applyCoupon}
              className="px-5 py-2.5 rounded-xl font-black text-sm text-white flex-shrink-0"
              style={{ background: '#FF2D78' }}
            >
              {t('cart.apply')}
            </button>
          </div>
        )}
        {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
      </div>

      {/* Loyalty points */}
      {points > 0 && (
        <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black text-light-text dark:text-dark-text">{t('loyalty.your_points')}</p>
              <p className="text-xs text-light-muted dark:text-dark-muted mt-0.5">
                {points} pts = {format(pointsToSAR(points))} · {t('checkout.points_available', { count: points })}
              </p>
            </div>
            <button
              type="button"
              onClick={togglePoints}
              className={`px-4 py-2 rounded-xl text-sm font-black border-2 transition-colors ${
                redeemed > 0
                  ? 'border-brand-pink bg-brand-pink/10 text-brand-pink'
                  : 'border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-brand-pink'
              }`}
            >
              {redeemed > 0 ? `−${format(redeemed)} applied` : t('checkout.redeem_points')}
            </button>
          </div>
        </div>
      )}

      <button type="button" onClick={onNext}
        className="w-full py-4 rounded-xl font-black text-white text-sm"
        style={{ background: '#FF2D78' }}
      >
        {t('checkout.continue_shipping') ?? 'Continue to Shipping'} →
      </button>
    </div>
  )
}

// ─── Step 2: Shipping ────────────────────────────────────────────────────────
function ShippingForm({ info, setInfo, onNext, onBack }) {
  const { t } = useTranslation()
  const { user, profile } = useAuth()
  const [errors, setErrors] = useState({})

  const fields = [
    { key: 'full_name', label: t('checkout.full_name'), type: 'text',  placeholder: 'Ahmed Al-Rashidi', defaultVal: profile?.display_name ?? '' },
    { key: 'email',     label: t('checkout.email'),     type: 'email', placeholder: 'ahmed@email.com',   defaultVal: user?.email ?? '' },
    { key: 'phone',     label: t('checkout.phone'),     type: 'tel',   placeholder: '+966 5x xxx xxxx',  defaultVal: '' },
    { key: 'address',   label: t('checkout.address'),   type: 'text',  placeholder: '123 King Fahad Rd', defaultVal: '' },
    { key: 'city',      label: t('checkout.city'),      type: 'text',  placeholder: 'Riyadh',            defaultVal: '' },
    { key: 'country',   label: t('checkout.country'),   type: 'text',  placeholder: 'Saudi Arabia',      defaultVal: 'Saudi Arabia' },
  ]

  // Pre-fill from auth on first render
  const [form, setForm] = useState(() => {
    const base = {}
    fields.forEach(f => { base[f.key] = info[f.key] ?? f.defaultVal })
    return base
  })

  function handleChange(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate() {
    const result = shippingSchema.safeParse(form)
    if (result.success) {
      setInfo(form)
      onNext()
    } else {
      const errs = {}
      result.error.errors.forEach(e => { errs[e.path[0]] = e.message })
      setErrors(errs)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {fields.map(f => (
          <div key={f.key} className={f.key === 'address' ? 'sm:col-span-2' : ''}>
            <label className="block text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1.5">{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className={`w-full border rounded-xl px-4 py-3 text-sm bg-transparent text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none transition-colors ${
                errors[f.key]
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-light-border dark:border-dark-border focus:border-brand-pink'
              }`}
            />
            {errors[f.key] && <p className="text-xs text-red-500 mt-1">{errors[f.key]}</p>}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="px-6 py-3 rounded-xl font-black text-sm border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-brand-pink transition-colors"
        >
          ← {t('common.back')}
        </button>
        <button type="button" onClick={validate}
          className="flex-1 py-3 rounded-xl font-black text-white text-sm"
          style={{ background: '#FF2D78' }}
        >
          {t('checkout.continue_payment') ?? 'Continue to Payment'} →
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Payment + Confirm ───────────────────────────────────────────────
function PaymentStep({ shippingInfo, totals, coupon, redeemed, onBack, onSuccess }) {
  const { t } = useTranslation()
  const { items, clearCart } = useCart()
  const { user } = useAuth()
  const { addPoints, sarToPoints } = useLoyalty()
  const { toast } = useToast()
  const { format } = useCurrency()
  const navigate = useNavigate()

  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function formatCardNumber(val) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  }
  function formatExpiry(val) {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    return digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits
  }

  function validateCard() {
    const errs = {}
    const num = card.number.replace(/\s/g, '')
    if (num.length !== 16) errs.number = 'Enter a valid 16-digit card number'
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) errs.expiry = 'Enter expiry as MM/YY'
    if (card.cvv.length < 3) errs.cvv = 'Enter 3-digit CVV'
    if (card.name.trim().length < 2) errs.name = 'Enter cardholder name'
    return errs
  }

  async function placeOrder() {
    const errs = validateCard()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      if (user) {
        // Insert order
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .insert({
            user_id:          user.id,
            total:            totals.total,
            subtotal:         totals.subtotal,
            shipping:         totals.shipping,
            vat:              totals.vat,
            discount:         totals.discount + redeemed,
            coupon_code:      coupon?.code ?? null,
            shipping_address: shippingInfo,
          })
          .select()
          .single()

        if (orderErr) throw orderErr

        // Insert order items
        const orderItems = items.map(i => ({
          order_id:   order.id,
          product_id: i.productId,
          title:      i.title,
          price:      i.price,
          qty:        i.qty,
          color:      i.color,
          size:       i.size,
          image:      i.image,
        }))
        await supabase.from('order_items').insert(orderItems)

        // Award loyalty points
        const earned = sarToPoints(totals.total)
        if (earned > 0) await addPoints(earned, `Order ${order.order_number}`)

        onSuccess(order.order_number)
      } else {
        // Guest checkout — no DB insert
        onSuccess(`ORD-${Date.now().toString(36).toUpperCase()}`)
      }

      clearCart()
    } catch (err) {
      toast.error(t('common.error'))
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const cardFields = [
    { key: 'number', label: 'Card Number',  placeholder: '1234 5678 9012 3456', span: 2,
      format: formatCardNumber, maxLen: 19 },
    { key: 'name',   label: 'Cardholder Name', placeholder: 'Ahmed Al-Rashidi', span: 2,
      format: v => v, maxLen: 40 },
    { key: 'expiry', label: 'Expiry (MM/YY)', placeholder: '12/27', span: 1,
      format: formatExpiry, maxLen: 5 },
    { key: 'cvv',    label: 'CVV', placeholder: '•••', span: 1,
      format: v => v.replace(/\D/g,'').slice(0,4), maxLen: 4 },
  ]

  return (
    <div>
      {/* Shipping summary */}
      <div className="mb-6 p-4 rounded-2xl bg-light-surface dark:bg-dark-surface text-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-black text-light-text dark:text-dark-text">{t('checkout.step_shipping')}</span>
          <button type="button" onClick={onBack} className="text-xs text-brand-pink font-black hover:opacity-70">{t('common.edit')}</button>
        </div>
        <p className="text-light-muted dark:text-dark-muted">{shippingInfo.full_name} · {shippingInfo.phone}</p>
        <p className="text-light-muted dark:text-dark-muted">{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.country}</p>
      </div>

      {/* Mock card form */}
      <div className="p-5 rounded-2xl border border-light-border dark:border-dark-border mb-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">💳</span>
          <p className="font-black text-sm text-light-text dark:text-dark-text">Card Details</p>
          <div className="ms-auto flex gap-1.5">
            {['VISA', 'MC', 'AMEX'].map(n => (
              <span key={n} className="text-[9px] font-black px-1.5 py-0.5 rounded border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted">{n}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {cardFields.map(f => (
            <div key={f.key} className={f.span === 2 ? 'col-span-2' : ''}>
              <label className="block text-[10px] font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1">{f.label}</label>
              <input
                type={f.key === 'cvv' ? 'password' : 'text'}
                inputMode="numeric"
                value={card[f.key]}
                onChange={e => {
                  const v = f.format(e.target.value)
                  setCard(prev => ({ ...prev, [f.key]: v }))
                  if (errors[f.key]) setErrors(prev => ({ ...prev, [f.key]: '' }))
                }}
                placeholder={f.placeholder}
                maxLength={f.maxLen}
                className={`w-full border rounded-xl px-4 py-3 text-sm bg-transparent text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none transition-colors font-mono ${
                  errors[f.key]
                    ? 'border-red-500'
                    : 'border-light-border dark:border-dark-border focus:border-brand-pink'
                }`}
              />
              {errors[f.key] && <p className="text-xs text-red-500 mt-1">{errors[f.key]}</p>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-light-muted dark:text-dark-muted flex items-center gap-1">
          🔒 {t('product.secure_payment')} — demo mode, no real charges
        </p>
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onBack}
          className="px-6 py-3 rounded-xl font-black text-sm border-2 border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-brand-pink transition-colors"
        >
          ← {t('common.back')}
        </button>
        <button type="button" onClick={placeOrder} disabled={loading}
          className="flex-1 py-3 rounded-xl font-black text-white text-sm disabled:opacity-60 transition-opacity"
          style={{ background: '#FF2D78' }}
        >
          {loading ? t('common.loading') : `${t('checkout.place_order')} · ${format(totals.total)}`}
        </button>
      </div>
    </div>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ orderNumber }) {
  const { t } = useTranslation()
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
        style={{ background: '#FF2D78' }}
      >
        ✓
      </motion.div>
      <h2 className="text-3xl font-black text-light-text dark:text-dark-text mb-2">
        {t('checkout.order_confirmed')}
      </h2>
      <p className="text-brand-pink font-black text-lg mb-2">
        {t('checkout.order_number', { number: orderNumber })}
      </p>
      <p className="text-sm text-light-muted dark:text-dark-muted mb-10 max-w-sm mx-auto">
        You'll receive a confirmation email shortly. Thank you for shopping with SportsWear!
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link to="/account"
          className="px-8 py-3 rounded-xl font-black text-sm border-2 border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
        >
          {t('account.orders')}
        </Link>
        <Link to="/shop"
          className="px-8 py-3 rounded-xl font-black text-sm text-white"
          style={{ background: '#FF2D78' }}
        >
          {t('nav.shop')}
        </Link>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { t } = useTranslation()
  const { items, subtotal } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  usePageTitle(t('cart.checkout'))

  const [step, setStep]             = useState(1)
  const [coupon, setCoupon]         = useState(null)
  const [couponInput, setCouponInput] = useState('')
  const [redeemed, setRedeemed]     = useState(0)
  const [shippingInfo, setShippingInfo] = useState({})
  const [orderNumber, setOrderNumber]   = useState(null)

  const FREE_SHIPPING_THRESHOLD = 300
  const VAT_RATE = 0.15

  const totals = useMemo(() => {
    let discount = 0
    if (coupon) {
      if (coupon.type === 'percent')   discount = (subtotal * coupon.value) / 100
      if (coupon.type === 'flat')      discount = Math.min(coupon.value, subtotal)
    }
    const shipping = (coupon?.type === 'shipping' || subtotal >= FREE_SHIPPING_THRESHOLD) ? 0 : 50
    const afterDiscount = Math.max(0, subtotal - discount - redeemed)
    const vat   = +(afterDiscount * VAT_RATE).toFixed(2)
    const total = +(afterDiscount + shipping + vat).toFixed(2)
    return { subtotal, discount, shipping, vat, total }
  }, [subtotal, coupon, redeemed])

  if (orderNumber) return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      <SuccessScreen orderNumber={orderNumber} />
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-black text-light-text dark:text-dark-text mb-2">{t('cart.checkout')}</h1>
      <StepBar step={step} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left: step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
          >
            {step === 1 && (
              <CartReview
                coupon={coupon} setCoupon={setCoupon}
                couponInput={couponInput} setCouponInput={setCouponInput}
                redeemed={redeemed} setRedeemed={setRedeemed}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <ShippingForm
                info={shippingInfo} setInfo={setShippingInfo}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <PaymentStep
                shippingInfo={shippingInfo}
                totals={totals}
                coupon={coupon}
                redeemed={redeemed}
                onBack={() => setStep(2)}
                onSuccess={(num) => setOrderNumber(num)}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Right: order summary */}
        <OrderSummary
          items={items}
          subtotal={totals.subtotal}
          discount={totals.discount}
          coupon={coupon?.code}
          redeemed={redeemed}
          shipping={totals.shipping}
          vat={totals.vat}
          total={totals.total}
        />
      </div>
    </div>
  )
}
