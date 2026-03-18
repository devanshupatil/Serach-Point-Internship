import { useState } from 'react'
import { addFeedback } from '../services/storage'

const TYPES = [
  { value: 'bug', label: '🐛 Report a Bug' },
  { value: 'feature', label: '✨ Request a Feature' },
  { value: 'other', label: '💬 Other' },
]

export default function HelpFeedback() {
  const [type, setType] = useState('bug')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return
    addFeedback({ type, message, email })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-emerald-500 text-3xl">check_circle</span>
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Thanks for your feedback!</h2>
        <p className="text-sm text-slate-400">We appreciate you taking the time to share your thoughts.</p>
        <button onClick={() => { setSubmitted(false); setMessage(''); setEmail('') }}
          className="mt-6 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/25">
          Send another
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">❓ Help & Feedback</h2>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Type</label>
            <div className="flex flex-col gap-2">
              {TYPES.map(({ value, label }) => (
                <label key={value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${type === value ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'}`}>
                  <input type="radio" name="type" value={value} checked={type === value} onChange={() => setType(value)} className="accent-primary" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Message</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4}
              placeholder="Describe your issue or idea in detail…"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Email <span className="normal-case font-normal">(optional)</span></label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary" />
          </div>

          <button type="submit"
            className="w-full h-11 bg-gradient-to-r from-primary to-blue-500 text-white font-bold rounded-xl shadow-md shadow-primary/25 hover:from-blue-600 hover:to-blue-400 transition-all">
            Send Feedback
          </button>
        </form>
      </div>
    </div>
  )
}
