import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { usePageTitle } from '@/hooks/usePageTitle'

// ─── Schemas ─────────────────────────────────────────────────────────────────
const signInSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(6),
})

const signUpSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters'),
  email:        z.string().email('Invalid email'),
  password:     z.string().min(8, 'Password must be at least 8 characters'),
  confirm:      z.string(),
}).refine(d => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

const forgotSchema = z.object({
  email: z.string().email('Invalid email'),
})

// ─── Shared field component ───────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, error, autoComplete }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full border rounded-xl px-4 py-3 text-sm bg-transparent text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none transition-colors pe-${isPassword ? '10' : '4'} ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-light-border dark:border-dark-border focus:border-brand-pink'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute end-3 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text"
            tabIndex={-1}
          >
            {show ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

// ─── OAuth buttons ────────────────────────────────────────────────────────────
function OAuthButtons({ loading, onGoogle, onApple }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-light-border dark:border-dark-border font-black text-sm text-light-text dark:text-dark-text hover:border-brand-pink transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {t('auth.continue_google')}
      </button>
      <button
        type="button"
        onClick={onApple}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-light-border dark:border-dark-border font-black text-sm text-light-text dark:text-dark-text hover:border-brand-pink transition-colors disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        {t('auth.continue_apple')}
      </button>
    </div>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-light-border dark:bg-dark-border" />
      <span className="text-xs text-light-muted dark:text-dark-muted font-semibold">or</span>
      <div className="flex-1 h-px bg-light-border dark:bg-dark-border" />
    </div>
  )
}

// ─── Sign In ──────────────────────────────────────────────────────────────────
function SignIn({ onSwitch, onSuccess }) {
  const { t } = useTranslation()
  const { signIn, signInWithGoogle, signInWithApple } = useAuth()
  const { error: toastError } = useToast()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function set(key) { return val => setForm(p => ({ ...p, [key]: val })) }

  async function submit(e) {
    e.preventDefault()
    const res = signInSchema.safeParse(form)
    if (!res.success) {
      const errs = {}
      res.error.errors.forEach(e => { errs[e.path[0]] = e.message })
      setErrors(errs); return
    }
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      onSuccess()
    } catch (err) {
      toastError(err.message ?? t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try { await signInWithGoogle() } catch (err) { toastError(err.message) } finally { setLoading(false) }
  }
  async function handleApple() {
    setLoading(true)
    try { await signInWithApple() } catch (err) { toastError(err.message) } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <OAuthButtons loading={loading} onGoogle={handleGoogle} onApple={handleApple} />
      <Divider />
      <Field label={t('auth.email')} type="email" value={form.email} onChange={set('email')}
        placeholder="you@example.com" error={errors.email} autoComplete="email" />
      <Field label={t('auth.password')} type="password" value={form.password} onChange={set('password')}
        placeholder="••••••••" error={errors.password} autoComplete="current-password" />

      <div className="flex justify-end">
        <button type="button" onClick={() => onSwitch('forgot')}
          className="text-xs font-black text-brand-pink hover:opacity-70 transition-opacity"
        >
          {t('auth.forgot_password')}
        </button>
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3.5 rounded-xl font-black text-white text-sm disabled:opacity-50 transition-opacity"
        style={{ background: '#FF2D78' }}
      >
        {loading ? t('common.loading') : t('auth.sign_in')}
      </button>

      <p className="text-center text-sm text-light-muted dark:text-dark-muted">
        {t('auth.no_account')}{' '}
        <button type="button" onClick={() => onSwitch('register')}
          className="font-black text-brand-pink hover:opacity-70 transition-opacity"
        >
          {t('auth.sign_up')}
        </button>
      </p>
    </form>
  )
}

// ─── Register ─────────────────────────────────────────────────────────────────
function Register({ onSwitch, onSuccess }) {
  const { t } = useTranslation()
  const { signUp, signInWithGoogle, signInWithApple } = useAuth()
  const { error: toastError } = useToast()
  const [form, setForm]     = useState({ display_name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone]     = useState(false)

  function set(key) { return val => setForm(p => ({ ...p, [key]: val })) }

  async function submit(e) {
    e.preventDefault()
    const res = signUpSchema.safeParse(form)
    if (!res.success) {
      const errs = {}
      res.error.errors.forEach(e => { errs[e.path[0]] = e.message })
      setErrors(errs); return
    }
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.display_name)
      setDone(true)
    } catch (err) {
      toastError(err.message ?? t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    try { await signInWithGoogle() } catch (err) { toastError(err.message) } finally { setLoading(false) }
  }
  async function handleApple() {
    setLoading(true)
    try { await signInWithApple() } catch (err) { toastError(err.message) } finally { setLoading(false) }
  }

  if (done) return (
    <div className="text-center py-6">
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: '#FF2D78' }}>✓</div>
      <h3 className="text-lg font-black text-light-text dark:text-dark-text mb-2">{t('auth.check_email') ?? 'Check your email'}</h3>
      <p className="text-sm text-light-muted dark:text-dark-muted mb-6">
        {t('auth.verify_sent') ?? `We sent a confirmation link to ${form.email}`}
      </p>
      <button type="button" onClick={() => onSwitch('login')} className="font-black text-sm text-brand-pink hover:opacity-70">
        ← {t('auth.sign_in')}
      </button>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <OAuthButtons loading={loading} onGoogle={handleGoogle} onApple={handleApple} />
      <Divider />
      <Field label={t('auth.display_name')} value={form.display_name} onChange={set('display_name')}
        placeholder="Ahmed Al-Rashidi" error={errors.display_name} autoComplete="name" />
      <Field label={t('auth.email')} type="email" value={form.email} onChange={set('email')}
        placeholder="you@example.com" error={errors.email} autoComplete="email" />
      <Field label={t('auth.password')} type="password" value={form.password} onChange={set('password')}
        placeholder="Min. 8 characters" error={errors.password} autoComplete="new-password" />
      <Field label={t('auth.confirm_password') ?? 'Confirm Password'} type="password" value={form.confirm} onChange={set('confirm')}
        placeholder="Repeat password" error={errors.confirm} autoComplete="new-password" />

      <button type="submit" disabled={loading}
        className="w-full py-3.5 rounded-xl font-black text-white text-sm disabled:opacity-50 transition-opacity"
        style={{ background: '#FF2D78' }}
      >
        {loading ? t('common.loading') : t('auth.sign_up')}
      </button>

      <p className="text-center text-sm text-light-muted dark:text-dark-muted">
        {t('auth.have_account')}{' '}
        <button type="button" onClick={() => onSwitch('login')}
          className="font-black text-brand-pink hover:opacity-70 transition-opacity"
        >
          {t('auth.sign_in')}
        </button>
      </p>
    </form>
  )
}

// ─── Forgot password ──────────────────────────────────────────────────────────
function ForgotPassword({ onSwitch }) {
  const { t } = useTranslation()
  const { resetPassword } = useAuth()
  const { error: toastError } = useToast()
  const [email, setEmail]   = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]     = useState(false)

  async function submit(e) {
    e.preventDefault()
    const res = forgotSchema.safeParse({ email })
    if (!res.success) { setError(res.error.errors[0].message); return }
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      toastError(err.message ?? t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  if (sent) return (
    <div className="text-center py-6">
      <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: '#0066FF' }}>📧</div>
      <h3 className="text-lg font-black text-light-text dark:text-dark-text mb-2">{t('auth.reset_sent') ?? 'Reset link sent'}</h3>
      <p className="text-sm text-light-muted dark:text-dark-muted mb-6">
        Check your inbox at <span className="font-semibold">{email}</span>
      </p>
      <button type="button" onClick={() => onSwitch('login')} className="font-black text-sm text-brand-pink hover:opacity-70">
        ← {t('auth.sign_in')}
      </button>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-light-muted dark:text-dark-muted">
        {t('auth.forgot_instructions') ?? "Enter your email and we'll send you a reset link."}
      </p>
      <Field label={t('auth.email')} type="email" value={email} onChange={setEmail}
        placeholder="you@example.com" error={error} autoComplete="email" />

      <button type="submit" disabled={loading}
        className="w-full py-3.5 rounded-xl font-black text-white text-sm disabled:opacity-50"
        style={{ background: '#0066FF' }}
      >
        {loading ? t('common.loading') : t('auth.reset_password')}
      </button>

      <p className="text-center">
        <button type="button" onClick={() => onSwitch('login')}
          className="text-sm font-black text-brand-pink hover:opacity-70 transition-opacity"
        >
          ← {t('auth.sign_in')}
        </button>
      </p>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TAB_TITLES = {
  login:    'auth.sign_in',
  register: 'auth.sign_up',
  forgot:   'auth.forgot_password',
}

export default function AuthPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  const [tab, setTab] = useState(
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  )

  usePageTitle(t(TAB_TITLES[tab]))

  function onSuccess() {
    navigate(next, { replace: true })
  }

  const tabs = [
    { id: 'login',    label: t('auth.sign_in') },
    { id: 'register', label: t('auth.sign_up') },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-light-bg dark:bg-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block text-2xl font-black text-light-text dark:text-dark-text tracking-tight">
            Sports<span style={{ color: '#FF2D78' }}>Wear</span>
          </Link>
          <p className="mt-1 text-sm text-light-muted dark:text-dark-muted">
            {tab === 'login'    ? 'Welcome back 👋' :
             tab === 'register' ? 'Join the community' :
             'Reset your password'}
          </p>
        </div>

        <div className="bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-2xl p-6 sm:p-8 shadow-card">
          {/* Tab switcher (only login + register) */}
          {tab !== 'forgot' && (
            <div className="flex mb-6 p-1 rounded-xl bg-light-surface dark:bg-dark-surface">
              {tabs.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 rounded-lg text-sm font-black transition-colors ${
                    tab === t.id
                      ? 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text shadow-sm'
                      : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Animated form swap */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
            >
              {tab === 'login'    && <SignIn    onSwitch={setTab} onSuccess={onSuccess} />}
              {tab === 'register' && <Register  onSwitch={setTab} onSuccess={onSuccess} />}
              {tab === 'forgot'   && <ForgotPassword onSwitch={setTab} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-xs text-light-muted dark:text-dark-muted">
          By continuing you agree to our{' '}
          <Link to="/support/terms" className="font-semibold hover:text-brand-pink transition-colors">Terms</Link>
          {' & '}
          <Link to="/support/privacy" className="font-semibold hover:text-brand-pink transition-colors">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  )
}
