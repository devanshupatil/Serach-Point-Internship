import { useState, useEffect } from 'react'
import { getItems, updateItem } from '../services/storage'
import { RowSkeleton } from '../components/Skeletons'

export default function ArchivePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => { setItems(getItems().filter(i => i.archived && !i.deleted)); setLoading(false) }
  useEffect(() => { load() }, [])

  const restore = (id) => { updateItem(id, { archived: false }); load() }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">📦 Archive</h2>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {loading ? (
          [...Array(3)].map((_, i) => <RowSkeleton key={i} />)
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">archive</span>
            <p className="text-sm font-semibold text-slate-400">Archive is empty</p>
            <p className="text-xs text-slate-300 mt-1">Right-click any item and choose Archive</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 capitalize">{item.type} · {item.category}</p>
                </div>
                <button onClick={() => restore(item.id)}
                  className="text-xs text-primary font-semibold hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
