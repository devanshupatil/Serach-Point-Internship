import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AddItemModal from './AddItemModal'

const NAV_MAIN = [
  { to: '/', icon: 'home', label: 'Home' },
  { to: '/search', icon: 'search', label: 'Search' },
  { to: '/category/all', icon: 'folder', label: 'Files' },
]
const NAV_MANAGE = [
  { to: '/archive', icon: 'archive', label: 'Archive' },
  { to: '/reminders', icon: 'notifications', label: 'Reminders' },
  { to: '/trash', icon: 'delete', label: 'Trash' },
]
const NAV_ACCOUNT = [
  { to: '/settings', icon: 'settings', label: 'Settings' },
  { to: '/help', icon: 'help', label: 'Help' },
]

export default function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
     ${isActive
       ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-primary font-semibold'
       : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`

  return (
    <div className="flex h-screen overflow-hidden bg-bg-light dark:bg-bg-dark font-display">
      <aside className="w-56 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col">
        <div className="p-4 flex items-center gap-2.5 border-b border-slate-50 dark:border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-white text-sm">cloud</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white leading-none">KeepBox</h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-400 mt-0.5">Cloud Storage</p>
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-3 py-2">Main</p>
          {NAV_MAIN.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={navItemClass}>
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </NavLink>
          ))}
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-3 py-2 mt-2">Manage</p>
          {NAV_MANAGE.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={navItemClass}>
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </NavLink>
          ))}
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-3 py-2 mt-2">Account</p>
          {NAV_ACCOUNT.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} className={navItemClass}>
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 border-2 border-blue-200 dark:border-blue-700 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white text-sm font-bold py-2.5 rounded-xl transition-all shadow-md shadow-primary/25"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            Add New
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center px-5 gap-3">
          <div className="flex-1 max-w-md">
            <button
              onClick={() => navigate('/search')}
              className="w-full flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-8 px-3 text-left hover:border-primary/40 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-400 text-[16px]">search</span>
              <span className="text-xs text-slate-400 flex-1">Search files, folders, links…</span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">⌘K</span>
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-slate-500 text-[18px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white dark:border-slate-900" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} />}
    </div>
  )
}
