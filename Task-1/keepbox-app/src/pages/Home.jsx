import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getItems, getFolders, deleteItem } from '../services/storage'
import ItemCard from '../components/ItemCard'
import { RowSkeleton } from '../components/Skeletons'

const CATEGORIES = [
  { type: 'Links', label: 'Links', sub: 'Saved resources', icon: 'link', from: '#2563eb', to: '#0ea5e9' },
  { type: 'Images', label: 'Images', sub: 'Photos & Graphics', icon: 'image', from: '#e11d48', to: '#f43f5e' },
  { type: 'Documents', label: 'Documents', sub: 'PDFs & Docs', icon: 'description', from: '#d97706', to: '#f59e0b' },
  { type: 'Videos', label: 'Videos', sub: 'Clips & Records', icon: 'movie', from: '#334155', to: '#475569' },
  { type: 'Notes', label: 'Notes', sub: 'Quick notes', icon: 'sticky_note_2', from: '#7c3aed', to: '#8b5cf6' },
]

const FOLDER_COLORS = ['bg-blue-100 text-blue-600', 'bg-rose-100 text-rose-500', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-500']

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setItems(getItems().filter(i => !i.deleted && !i.archived))
    setFolders(getFolders())
    setLoading(false)
  }, [])

  const refresh = () => setItems(getItems().filter(i => !i.deleted && !i.archived))
  const recent = items.slice(0, 8)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-slate-400 mt-1">Dashboard</p>
        </div>
        <div className="flex bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-1 gap-1">
          {['Today', 'Week', 'Month'].map((t, i) => (
            <button key={t} className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${i === 0 ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>{t}</button>
          ))}
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">📌 Pinned Folders</h3>
          <button onClick={() => navigate('/category/all')} className="text-xs font-semibold text-primary hover:underline">View all</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {folders.slice(0, 4).map((folder, i) => (
            <Link key={folder.id} to={`/folder/${folder.id}`}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${FOLDER_COLORS[i % FOLDER_COLORS.length]}`}>
                  <span className="material-symbols-outlined text-xl">folder</span>
                </div>
                <span className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-colors text-[18px]">push_pin</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{folder.name}</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {items.filter(item => item.folderId === folder.id).length} items
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">🗂 Browse by Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORIES.map(({ type, label, sub, icon, from, to }) => (
            <button key={type} onClick={() => navigate(`/category/${type}`)}
              style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
              className="relative overflow-hidden rounded-2xl aspect-[4/3] p-4 flex flex-col justify-between group cursor-pointer">
              <span className="material-symbols-outlined text-white/50 group-hover:text-white/80 transition-opacity text-3xl">{icon}</span>
              <div>
                <p className="text-sm sm:text-base font-black text-white">{label}</p>
                <p className="text-xs text-white/70 hidden sm:block">{sub}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[80px] text-white">{icon}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">🕐 Recently Saved</h3>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden overflow-x-auto">
          {loading ? (
            <div>{[...Array(4)].map((_, i) => <RowSkeleton key={i} />)}</div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">inbox</span>
              <p className="text-sm font-semibold text-slate-400">No items saved yet</p>
              <p className="text-xs text-slate-300 mt-1">Click "Add New" to save your first item</p>
            </div>
          ) : (
            <div className="min-w-[600px]">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <tr className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Modified</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {recent.map(item => (
                    <ItemCard key={item.id} item={item}
                      onUpdate={refresh}
                      onDelete={(id) => { deleteItem(id); refresh() }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
