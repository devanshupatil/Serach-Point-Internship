function Pulse({ className }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`} />
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 p-4 space-y-2">
      <Pulse className="h-8 w-8 rounded-lg" />
      <Pulse className="h-3 w-3/4" />
      <Pulse className="h-2 w-1/2" />
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
      <Pulse className="h-5 w-5 rounded" />
      <Pulse className="h-3 flex-1" />
      <Pulse className="h-2 w-20" />
    </div>
  )
}
