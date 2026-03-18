import { useState, useEffect } from 'react'
import { getItems, updateItem, permanentDelete } from '../services/storage'

export default function TrashPage() {
  const [items, setItems] = useState([])

  const load = () => setItems(getItems().filter(i => i.deleted))
  useEffect(() => { load() }, [])

  const restore = (id) => { updateItem(id, { deleted: false }); load() }
  const permDelete = (id) => {
    if (!confirm('Permanently delete this item? This cannot be undone.')) return
    permanentDelete(id)
    load()
  }
  const emptyTrash = () => {
    if (!confirm(`Permanently delete all ${items.length} items? This cannot be undone.`)) return
    items.forEach(i => permanentDelete(i.id))
    load()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">🗑️ Trash</h2>
        {items.length > 0 && (
          <button onClick={emptyTrash}
            className="text-xs text-red-500 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-900 transition-colors">
            Empty Trash ({items.length})
          </button>
        )}
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">delete_outline</span>
            <p className="text-sm font-semibold text-slate-400">Trash is empty</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <div>
                  <p className="text-sm font-semibold text-slate-500 line-through">{item.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 capitalize">{item.type}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => restore(item.id)} className="text-xs text-primary font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">Restore</button>
                  <button onClick={() => permDelete(item.id)} className="text-xs text-red-500 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete forever</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
