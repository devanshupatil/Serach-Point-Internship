import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    login({ name: form.name, email: form.email })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark p-4">
      <div className="flex w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
        <div className="hidden md:flex w-52 flex-shrink-0 flex-col justify-between p-7 bg-gradient-to-br from-blue-700 via-primary to-sky-500 relative overflow-hidden">
          <div className="absolute w-40 h-40 bg-white/5 rounded-full -bottom-10 -left-10" />
          <div className="absolute w-24 h-24 bg-white/5 rounded-full top-5 -right-8" />
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">cloud</span>
            </div>
            <div>
              <h1 className="text-white font-black text-base leading-none">KeepBox</h1>
              <p className="text-white/60 text-[9px] uppercase tracking-widest mt-0.5">Cloud Storage</p>
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="text-white font-black text-xl leading-snug">Save everything that matters.</h2>
            <p className="text-white/70 text-xs mt-2 leading-relaxed">Links, files, images — all in one secure place.</p>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 p-8 flex flex-col justify-center">
          <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">Welcome back</h2>
          <p className="text-xs text-slate-400 mb-6">Sign in to continue to KeepBox</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Full Name</label>
              <input
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all mt-2"
            >
              Sign In →
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
