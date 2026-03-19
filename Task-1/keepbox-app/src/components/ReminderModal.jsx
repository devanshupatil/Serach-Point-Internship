import { useState } from 'react'
import { updateItem } from '../services/storage'

export default function ReminderModal({ item, onClose, onUpdated }) {
  const [date, setDate] = useState(item.reminder?.date || '')
  const [time, setTime] = useState(item.reminder?.time || '')

  const save = () => {
    if (!date || !time) return
    const updated = updateItem(item.id, { reminder: { date, time } })
    onUpdated?.(updated)
    onClose()
  }

  const clear = () => {
    const updated = updateItem(item.id, { reminder: null })
    onUpdated?.(updated)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-80">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-white">Set Reminder</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">✕</button>
        </div>
        <div className="px-5 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex-1 h-10 bg-gradient-to-r from-primary to-blue-500 text-white font-bold rounded-xl shadow-md shadow-primary/25">Save</button>
            {item.reminder && (
              <button onClick={clear} className="flex-1 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 font-semibold rounded-xl">Clear</button>
            )}
            <button onClick={onClose} className="flex-1 h-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
