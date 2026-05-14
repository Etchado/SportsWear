import { cn } from '@/lib/utils'

const BADGE_STYLES = {
  NEW:        { bg: '#0066FF', text: '#fff' },
  SALE:       { bg: '#FF2D78', text: '#fff' },
  BESTSELLER: { bg: '#0A0A0A', text: '#CCFF00' },
  EXCLUSIVE:  { bg: '#CCFF00', text: '#0A0A0A' },
}

export default function Badge({ label, className }) {
  if (!label) return null
  const style = BADGE_STYLES[label] ?? { bg: '#718096', text: '#fff' }
  return (
    <span
      className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider', className)}
      style={{ background: style.bg, color: style.text }}
    >
      {label}
    </span>
  )
}
