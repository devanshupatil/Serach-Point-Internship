import { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '../services/storage'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} role="switch" aria-checked={on}
      className={`relative w-10 h-6 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? 'left-5' : 'left-1'}`} />
    </button>
  )
}

function SettingsRow({ icon, iconBg, label, description, right }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${iconBg}`}>{icon}</div>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{label}</p>
          {description && <p className="text-xs text-slate-400">{description}</p>}
        </div>
      </div>
      {right}
    </div>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState(getSettings)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const toggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] }
    updateSettings(updated)
    setSettings(updated)
    if (key === 'theme') {
      document.documentElement.classList.toggle('dark', updated.theme === 'dark')
    }
  }

  const setTheme = (theme) => {
    const updated = { ...settings, theme }
    updateSettings(updated)
    setSettings(updated)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark')
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">⚙️ Settings</h2>

      <div className="space-y-4">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Appearance</p>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <SettingsRow icon="🌙" iconBg="bg-blue-50 dark:bg-blue-900/20" label="Dark Mode" description="Switch to dark theme"
              right={<Toggle on={settings.theme === 'dark'} onToggle={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')} />}
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Notifications</p>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <SettingsRow icon="🔔" iconBg="bg-blue-50 dark:bg-blue-900/20" label="Push Notifications" description="Get alerts for reminders"
              right={<Toggle on={settings.notifications} onToggle={() => toggle('notifications')} />}
            />
            <SettingsRow icon="⏰" iconBg="bg-amber-50 dark:bg-amber-900/20" label="Reminder Alerts" description="Notify when reminder is due"
              right={<Toggle on={settings.reminderToggle} onToggle={() => toggle('reminderToggle')} />}
            />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Account</p>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <SettingsRow icon="📤" iconBg="bg-rose-50 dark:bg-rose-900/20" label="Export Data" description="Download all your items as JSON"
              right={<button className="text-xs text-primary font-semibold hover:underline">Export →</button>}
            />
            <SettingsRow icon="🚪" iconBg="bg-red-50 dark:bg-red-900/20" label="Sign Out" description="Log out of KeepBox"
              right={<button onClick={handleLogout} className="text-xs text-red-500 font-semibold hover:underline">Sign out</button>}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
