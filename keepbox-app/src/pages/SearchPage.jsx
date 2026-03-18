import { useState, useEffect } from 'react'
import { getItems, deleteItem } from '../services/storage'
import ItemCard from '../components/ItemCard'

const FILTERS = ['All', 'Links', 'Images', 'Documents', 'Videos', 'Notes']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [results, setResults] = useState([])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!query.trim()) { setResults([]); return }
      const q = query.toLowerCase()
      const found = getItems().filter(i =>
        !i.deleted && !i.archived &&
        (filter === 'All' || i.category === filter) &&
        (i.title?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q) || i.content?.toLowerCase().includes(q))
      )
      setResults(found)
    }, 300)
    return () => clearTimeout(timer)
  }, [query, filter])

  const refresh = () => {
    const q = query.toLowerCase()
    setResults(getItems().filter(i =>
      !i.deleted && !i.archived &&
      (filter === 'All' || i.category === filter) &&
      (i.title?.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q))
    ))
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">Search</h2>

      <div className="relative mb-4">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search files, links, notes…"
          className="w-full pl-10 pr-4 h-12 bg-white dark:bg-slate-900 border-2 border-primary/30 focus:border-primary rounded-2xl text-sm shadow-md shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === f ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-700 hover:border-primary/40'}`}>
            {f}
          </button>
        ))}
      </div>

      {query.trim() && (
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
        </p>
      )}

      {results.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <table className="w-full">
            <tbody>
              {results.map(item => (
                <ItemCard key={item.id} item={item} onUpdate={refresh} onDelete={(id) => { deleteItem(id); refresh() }} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">search_off</span>
          <p className="text-sm font-semibold text-slate-400">No results for "{query}"</p>
          <p className="text-xs text-slate-300 mt-1">Try different keywords or a different filter</p>
        </div>
      )}
    </div>
  )
}
