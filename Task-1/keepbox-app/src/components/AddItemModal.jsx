import { useState, useEffect } from 'react'
import { addItem, getFolders } from '../services/storage'

const TYPES = ['Link', 'Image', 'Document', 'Note']
const CATEGORY_MAP = { Link: 'Links', Image: 'Images', Document: 'Documents', Note: 'Notes' }

export default function AddItemModal({ onClose, onAdded }) {
  const [type, setType] = useState('Link')
  const [folders, setFolders] = useState([])
  const [form, setForm] = useState({ title: '', content: '', description: '', folderId: '' })

  useEffect(() => { setFolders(getFolders()) }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const item = addItem({
      type: type.toLowerCase(),
      category: CATEGORY_MAP[type],
      autoCategory: CATEGORY_MAP[type],
      title: form.title,
      content: form.content,
      description: form.description,
      folderId: form.folderId || null,
    })
    onAdded?.(item)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-black text-slate-900 dark:text-white">Add New Item</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700">✕</button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1 mb-5">
            {TYPES.map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${type === t ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} required placeholder={type === 'Link' ? 'My saved link' : 'Item title'}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
          </div>

          {(type === 'Link') && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">URL</label>
              <input value={form.content} onChange={e => set('content', e.target.value)} placeholder="https://" type="url"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
            </div>
          )}

          {(type === 'Note') && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Content</label>
              <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={3} placeholder="Write your note…"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none" />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Folder</label>
            <select value={form.folderId} onChange={e => set('folderId', e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary">
              <option value="">No folder</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Description <span className="normal-case font-normal">(optional)</span></label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Optional notes…"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit"
              className="flex-1 h-11 bg-gradient-to-r from-primary to-blue-500 text-white font-bold rounded-xl shadow-md shadow-primary/25 hover:from-blue-600 hover:to-blue-400 transition-all">
              Save Item
            </button>
            <button type="button" onClick={onClose}
              className="w-24 h-11 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
