import { useState, useEffect } from 'react'
import { getItems } from '../services/storage'
import ReminderModal from '../components/ReminderModal'

export default function ReminderPage() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)

  const load = () => setItems(getItems().filter(i => i.reminder && !i.deleted && !i.archived))
  useEffect(() => { load() }, [])

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">🔔 Reminders</h2>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-3">notifications_none</span>
            <p className="text-sm font-semibold text-slate-400">No reminders set</p>
            <p className="text-xs text-slate-300 mt-1">Right-click any item and choose "Set Reminder"</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map(item => (
              <div key={item.id} onClick={() => setSelected(item)}
                className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                <div className="min-w-0 mr-3">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.title}</p>
                  <p className="text-xs text-primary mt-0.5">{item.reminder.date} at {item.reminder.time}</p>
                </div>
                <span className="material-symbols-outlined text-slate-300 text-[20px] flex-shrink-0">notifications</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {selected && (
        <ReminderModal item={selected} onClose={() => setSelected(null)} onUpdated={load} />
      )}
    </div>
  )
}
