import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { usePageTitle } from '@/hooks/usePageTitle'
import { getClothingSize, euToUS, euToUK, cmToIn, kgToLbs, inToCm, lbsToKg } from '@/lib/sizeLogic'

// ─── Data tables ────────────────────────────────────────────────────────────

const CLOTHING_CHART = [
  { size: 'XS',  chest: '81–86',  waist: '66–71',  hips: '86–91',  chestIn: '32–34', waistIn: '26–28', hipsIn: '34–36' },
  { size: 'S',   chest: '86–92',  waist: '71–76',  hips: '91–97',  chestIn: '34–36', waistIn: '28–30', hipsIn: '36–38' },
  { size: 'M',   chest: '92–100', waist: '76–82',  hips: '97–102', chestIn: '36–39', waistIn: '30–32', hipsIn: '38–40' },
  { size: 'L',   chest: '100–108',waist: '82–88',  hips: '102–108',chestIn: '39–42', waistIn: '32–35', hipsIn: '40–43' },
  { size: 'XL',  chest: '108–116',waist: '88–96',  hips: '108–114',chestIn: '42–46', waistIn: '35–38', hipsIn: '43–45' },
  { size: '2XL', chest: '116–124',waist: '96–104', hips: '114–120',chestIn: '46–49', waistIn: '38–41', hipsIn: '45–47' },
  { size: '3XL', chest: '124–132',waist: '104–112',hips: '120–126',chestIn: '49–52', waistIn: '41–44', hipsIn: '47–50' },
]

const SHOE_EU_SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]

const BRAND_NOTES = [
  { brand: 'Nike',         note: 'Runs half a size small — size up for best fit', noteAr: 'يميل للضيق نصف مقاس — يُفضل أخذ مقاس أكبر' },
  { brand: 'Adidas',       note: 'True to size',                                  noteAr: 'مطابق للمقاس المعتاد' },
  { brand: 'Puma',         note: 'True to size, slightly narrow fit',             noteAr: 'مطابق للمقاس، قالب ضيق قليلاً' },
  { brand: 'Under Armour', note: 'True to size',                                  noteAr: 'مطابق للمقاس المعتاد' },
  { brand: 'New Balance',  note: 'Runs half a size large — consider sizing down', noteAr: 'يميل للواسع نصف مقاس — يُفضل أخذ مقاس أصغر' },
]

// ─── Subcomponents ───────────────────────────────────────────────────────────

function SectionHeader({ children }) {
  return (
    <h2 className="text-xl sm:text-2xl font-black text-light-text dark:text-dark-text mb-6 pb-3 border-b border-light-border dark:border-dark-border">
      {children}
    </h2>
  )
}

function UnitToggle({ metric, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="inline-flex rounded-xl border border-light-border dark:border-dark-border overflow-hidden text-sm font-black">
      {[{ label: t('size_guide.metric'), val: true }, { label: t('size_guide.imperial'), val: false }].map(({ label, val }) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(val)}
          className={`px-4 py-2 transition-colors ${
            metric === val
              ? 'bg-brand-pink text-white'
              : 'text-light-muted dark:text-dark-muted hover:bg-light-surface dark:hover:bg-dark-surface'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function FitFinder() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const [metric, setMetric] = useState(true)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [chest,  setChest]  = useState('')
  const [result, setResult] = useState(null)

  function calculate() {
    const chestCm = chest
      ? (metric ? Number(chest) : inToCm(Number(chest)))
      : null

    if (!chestCm) return

    const clothingSize = getClothingSize(chestCm)

    // Rough shoe size from height
    let shoeEU = null
    if (height) {
      const heightCm = metric ? Number(height) : inToCm(Number(height))
      // Very rough heuristic: foot length ≈ height / 6.6
      const footCm = heightCm / 6.6
      // EU = foot_cm * 1.5 + 2 (simplified Mondopoint)
      shoeEU = Math.round(footCm * 1.5 + 2)
      shoeEU = Math.max(36, Math.min(46, shoeEU))
    }

    setResult({ clothingSize, shoeEU })
  }

  const unit = metric ? 'cm' : 'in'
  const wtUnit = metric ? 'kg' : 'lbs'

  return (
    <div className="rounded-2xl bg-light-surface dark:bg-dark-surface p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h3 className="text-lg font-black text-light-text dark:text-dark-text">{t('size_guide.title')}</h3>
        <UnitToggle metric={metric} onChange={setMetric} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: `${t('size_guide.height')} (${unit})`, value: height, set: setHeight, placeholder: metric ? '175' : '69' },
          { label: `${t('size_guide.weight')} (${wtUnit})`, value: weight, set: setWeight, placeholder: metric ? '75' : '165' },
          { label: `${t('size_guide.chest')} (${unit})`, value: chest,  set: setChest,  placeholder: metric ? '96' : '38' },
        ].map(({ label, value, set, placeholder }) => (
          <div key={label}>
            <label className="block text-xs font-black text-light-muted dark:text-dark-muted uppercase tracking-wider mb-1.5">{label}</label>
            <input
              type="number"
              value={value}
              onChange={e => set(e.target.value)}
              placeholder={placeholder}
              className="w-full border border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg rounded-xl px-4 py-3 text-sm text-light-text dark:text-dark-text placeholder:text-light-muted dark:placeholder:text-dark-muted focus:outline-none focus:border-brand-pink transition-colors"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={calculate}
        disabled={!chest}
        className="w-full sm:w-auto px-8 py-3 rounded-xl font-black text-sm text-white disabled:opacity-40 transition-opacity"
        style={{ background: '#FF2D78' }}
      >
        {t('size_guide.recommended_size')}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 grid grid-cols-2 gap-4"
          >
            <div className="rounded-xl p-4 text-center border-2 border-brand-pink bg-brand-pink/5">
              <p className="text-xs font-black uppercase tracking-widest text-brand-pink mb-1">{t('size_guide.clothing_chart')}</p>
              <p className="text-4xl font-black text-light-text dark:text-dark-text">{result.clothingSize}</p>
            </div>
            {result.shoeEU && (
              <div className="rounded-xl p-4 text-center border-2 border-brand-blue bg-brand-blue/5">
                <p className="text-xs font-black uppercase tracking-widest text-brand-blue mb-1">{t('size_guide.shoe_chart')}</p>
                <p className="text-4xl font-black text-light-text dark:text-dark-text">EU {result.shoeEU}</p>
                <p className="text-xs text-light-muted dark:text-dark-muted mt-1">
                  US {euToUS(result.shoeEU)} · UK {euToUK(result.shoeEU)}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ClothingChart({ metric }) {
  const { t } = useTranslation()
  const cols = metric
    ? [
        { key: 'size',  label: t('size_guide.eu') },
        { key: 'chest', label: `${t('size_guide.chest')} (cm)` },
        { key: 'waist', label: `${t('size_guide.waist')} (cm)` },
        { key: 'hips',  label: `${t('size_guide.hips')} (cm)` },
      ]
    : [
        { key: 'size',    label: t('size_guide.eu') },
        { key: 'chestIn', label: `${t('size_guide.chest')} (in)` },
        { key: 'waistIn', label: `${t('size_guide.waist')} (in)` },
        { key: 'hipsIn',  label: `${t('size_guide.hips')} (in)` },
      ]

  return (
    <div className="overflow-x-auto rounded-2xl border border-light-border dark:border-dark-border">
      <table className="w-full text-sm min-w-[420px]">
        <thead>
          <tr className="bg-light-surface dark:bg-dark-surface">
            {cols.map(c => (
              <th key={c.key} className="px-4 py-3 text-start text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CLOTHING_CHART.map((row, i) => (
            <tr key={row.size} className={i % 2 === 0 ? '' : 'bg-light-surface/50 dark:bg-dark-surface/50'}>
              {cols.map(c => (
                <td key={c.key} className={`px-4 py-3 text-light-text dark:text-dark-text ${c.key === 'size' ? 'font-black' : ''}`}>
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ShoeChart() {
  const { t } = useTranslation()
  return (
    <div className="overflow-x-auto rounded-2xl border border-light-border dark:border-dark-border">
      <table className="w-full text-sm min-w-[360px]">
        <thead>
          <tr className="bg-light-surface dark:bg-dark-surface">
            {[t('size_guide.eu'), t('size_guide.us'), t('size_guide.uk'), 'cm', 'in'].map(h => (
              <th key={h} className="px-4 py-3 text-start text-xs font-black uppercase tracking-wider text-light-muted dark:text-dark-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SHOE_EU_SIZES.map((eu, i) => {
            const us  = euToUS(eu)
            const uk  = euToUK(eu)
            const cm  = +((eu - 2) / 1.5).toFixed(1)
            const inch = cmToIn(cm)
            return (
              <tr key={eu} className={i % 2 === 0 ? '' : 'bg-light-surface/50 dark:bg-dark-surface/50'}>
                <td className="px-4 py-3 font-black text-light-text dark:text-dark-text">{eu}</td>
                <td className="px-4 py-3 text-light-text dark:text-dark-text">{us}</td>
                <td className="px-4 py-3 text-light-text dark:text-dark-text">{uk}</td>
                <td className="px-4 py-3 text-light-text dark:text-dark-text">{cm}</td>
                <td className="px-4 py-3 text-light-text dark:text-dark-text">{inch}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function BrandNotes() {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === 'ar'
  const BRAND_COLORS = { Nike: '#FF2D78', Adidas: '#0066FF', Puma: '#CCFF00', 'Under Armour': '#22c55e', 'New Balance': '#f97316' }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {BRAND_NOTES.map(({ brand, note, noteAr }) => (
        <div
          key={brand}
          className="rounded-2xl border border-light-border dark:border-dark-border p-5 flex items-start gap-4"
        >
          <div
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black"
            style={{ background: `${BRAND_COLORS[brand]}22`, color: BRAND_COLORS[brand] }}
          >
            {brand.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-black text-sm text-light-text dark:text-dark-text mb-1">{brand}</p>
            <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
              {isAr ? noteAr : note}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SizeGuidePage() {
  const { t } = useTranslation()
  const [metric, setMetric] = useState(true)
  usePageTitle(t('size_guide.title'))

  const sections = [
    {
      id: 'finder',
      label: '📏 ' + t('size_guide.title'),
    },
    {
      id: 'clothing',
      label: '👕 ' + t('size_guide.clothing_chart'),
    },
    {
      id: 'shoes',
      label: '👟 ' + t('size_guide.shoe_chart'),
    },
    {
      id: 'brands',
      label: '🏷 Brand Fit Notes',
    },
  ]

  const [active, setActive] = useState('finder')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: '#FF2D78' }}>
          {t('nav.help') ?? 'Help'}
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-light-text dark:text-dark-text">
          {t('size_guide.title')}
        </h1>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 p-1 rounded-2xl bg-light-surface dark:bg-dark-surface mb-10 overflow-x-auto">
        {sections.map(s => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-black transition-colors whitespace-nowrap ${
              active === s.id
                ? 'bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text shadow-card'
                : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {active === 'finder' && <FitFinder />}

          {active === 'clothing' && (
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <SectionHeader>{t('size_guide.clothing_chart')}</SectionHeader>
                <UnitToggle metric={metric} onChange={setMetric} />
              </div>
              <ClothingChart metric={metric} />
              <p className="mt-4 text-xs text-light-muted dark:text-dark-muted">
                * All measurements are in {metric ? 'centimetres (cm)' : 'inches (in)'}. For best fit, measure over the widest part.
              </p>
            </div>
          )}

          {active === 'shoes' && (
            <div>
              <SectionHeader>{t('size_guide.shoe_chart')}</SectionHeader>
              <ShoeChart />
              <p className="mt-4 text-xs text-light-muted dark:text-dark-muted">
                * Foot length measured from heel to longest toe on a flat surface. Measure both feet and use the larger measurement.
              </p>
            </div>
          )}

          {active === 'brands' && (
            <div>
              <SectionHeader>Brand Fit Notes</SectionHeader>
              <BrandNotes />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
