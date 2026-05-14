import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/context/ToastContext'

function StarRating({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0)
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
  const display = hovered || value
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type={onChange ? 'button' : 'submit'}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => onChange && setHovered(n)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`${sz} transition-colors ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
          style={{ color: n <= display ? '#FF2D78' : '#D1D5DB' }}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function RatingBar({ label, pct }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-6 text-end text-light-muted dark:text-dark-muted">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
        <div className="h-full rounded-full bg-brand-pink transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-light-muted dark:text-dark-muted">{Math.round(pct)}%</span>
    </div>
  )
}

export default function ReviewsSection({ productId, rating = 0, reviewCount = 0, reviews: initialReviews = [] }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { toast } = useToast()

  const [reviews, setReviews] = useState(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [body, setBody] = useState('')

  async function submitReview(e) {
    e.preventDefault()
    if (!body.trim() || newRating === 0) return
    setSubmitting(true)
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({ product_id: productId, user_id: user.id, rating: newRating, body: body.trim() })
        .select()
        .single()
      if (error) throw error
      setReviews(prev => [data, ...prev])
      setShowForm(false)
      setBody('')
      setNewRating(5)
      toast.success(t('product.review_submitted'))
    } catch {
      toast.error(t('common.error'))
    } finally {
      setSubmitting(false)
    }
  }

  // Distribution bars
  const dist = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length
    const pct   = reviews.length > 0 ? (count / reviews.length) * 100 : 0
    return { star, pct }
  })

  return (
    <section className="mt-16">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl font-black text-light-text dark:text-dark-text">
          {t('product.reviews')} <span className="text-light-muted dark:text-dark-muted font-semibold text-lg">({reviewCount || reviews.length})</span>
        </h2>
        {user && !showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-sm font-black px-5 py-2 rounded-xl border-2 border-brand-pink text-brand-pink hover:bg-brand-pink hover:text-white transition-colors"
          >
            {t('product.write_review')}
          </button>
        )}
      </div>

      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 rounded-2xl bg-light-surface dark:bg-dark-surface">
          <div className="text-center sm:text-start">
            <p className="text-5xl font-black text-light-text dark:text-dark-text">{(rating || 0).toFixed(1)}</p>
            <StarRating value={Math.round(rating)} size="sm" />
            <p className="text-xs text-light-muted dark:text-dark-muted mt-1">{reviews.length} {t('product.reviews')}</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {dist.map(({ star, pct }) => (
              <RatingBar key={star} label={star} pct={pct} />
            ))}
          </div>
        </div>
      )}

      {/* Write review form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={submitReview}
            className="mb-8 p-5 rounded-2xl border border-light-border dark:border-dark-border overflow-hidden"
          >
            <h3 className="font-black text-light-text dark:text-dark-text mb-4">{t('product.write_review')}</h3>
            <div className="mb-4">
              <p className="text-sm text-light-muted dark:text-dark-muted mb-2">{t('product.your_rating')}</p>
              <StarRating value={newRating} onChange={setNewRating} />
            </div>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={t('product.review_placeholder')}
              rows={4}
              className="w-full border border-light-border dark:border-dark-border rounded-xl px-4 py-3 text-sm bg-transparent text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-brand-pink resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button
                type="submit"
                disabled={submitting || !body.trim()}
                className="px-6 py-2.5 rounded-xl font-black text-sm text-white disabled:opacity-50 transition-opacity"
                style={{ background: '#FF2D78' }}
              >
                {submitting ? t('common.loading') : t('product.submit_review')}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl font-black text-sm text-light-muted dark:text-dark-muted border border-light-border dark:border-dark-border"
              >
                {t('common.cancel')}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews list */}
      <div className="space-y-5">
        {reviews.length === 0 && (
          <p className="text-sm text-light-muted dark:text-dark-muted text-center py-8">
            {t('product.no_reviews')}
          </p>
        )}
        {reviews.map(review => (
          <div key={review.id} className="border-b border-light-border dark:border-dark-border pb-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black"
                  style={{ background: '#FF2D78' }}
                >
                  {(review.reviewer_name ?? 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-black text-light-text dark:text-dark-text">
                    {review.reviewer_name ?? t('product.anonymous')}
                  </p>
                  <p className="text-[10px] text-light-muted dark:text-dark-muted">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <StarRating value={review.rating} size="sm" />
            </div>
            <p className="text-sm text-light-text dark:text-dark-text leading-relaxed">{review.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
