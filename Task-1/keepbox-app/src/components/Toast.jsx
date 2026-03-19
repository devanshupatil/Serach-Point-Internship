import { useEffect } from 'react'

const VARIANTS = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-primary',
}

export default function Toast({ message, variant = 'success', onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl text-white text-sm font-semibold shadow-xl animate-slide-in ${VARIANTS[variant]}`}>
      {message}
      <button onClick={onDismiss} className="ml-1 opacity-70 hover:opacity-100">✕</button>
    </div>
  )
}
