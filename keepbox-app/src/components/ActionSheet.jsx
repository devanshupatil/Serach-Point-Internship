import { useEffect, useRef } from 'react'
import { updateItem } from '../services/storage'

export default function ActionSheet({ item, position, onClose, onUpdate, onDelete }) {
  const ref = useRef()

  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) onClose() }
    const keyHandler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', keyHandler)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', keyHandler) }
  }, [onClose])

  const actions = [
    { icon: 'star', label: item.starred ? 'Unstar' : 'Star', action: () => { onUpdate(updateItem(item.id, { starred: !item.starred })); onClose() } },
    { icon: 'edit', label: 'Edit', action: () => { onClose(); onUpdate({ ...item, _openEdit: true }) } },
    { icon: 'archive', label: 'Archive', action: () => { onUpdate(updateItem(item.id, { archived: true })); onClose() } },
    { icon: 'notifications', label: 'Set Reminder', action: () => { onClose(); onUpdate({ ...item, _openReminder: true }) } },
  ]

  return (
    <div
      ref={ref}
      style={{ position: 'fixed', top: position.y, left: position.x, zIndex: 1000 }}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl py-1.5 w-44 text-sm"
    >
      {actions.map(({ icon, label, action }) => (
        <button key={label} onClick={action}
          className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors text-left">
          <span className="material-symbols-outlined text-[16px] text-slate-400">{icon}</span>
          {label}
        </button>
      ))}
      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
      <button onClick={() => { onDelete(item.id); onClose() }}
        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors text-left">
        <span className="material-symbols-outlined text-[16px]">delete</span>
        Delete
      </button>
    </div>
  )
}
