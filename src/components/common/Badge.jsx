const STYLES = {
  overdue: 'bg-red-100 text-red-700 ring-red-200',
  today: 'bg-amber-100 text-amber-800 ring-amber-200',
  soon: 'bg-yellow-50 text-yellow-700 ring-yellow-200',
  ok: 'bg-leaf-100 text-leaf-700 ring-leaf-200',
  neutral: 'bg-sand-100 text-sand-500 ring-sand-200',
}

export default function Badge({ level = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${STYLES[level] ?? STYLES.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
