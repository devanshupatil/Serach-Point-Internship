import React from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Database, 
  Bell, 
  Moon, 
  Sun, 
  LogOut, 
  RefreshCw 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState({
    reminders: true,
    push: false
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark');
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <SettingsIcon className="w-6 h-6" />
        Settings
      </h2>

      {/* Account Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <User className="w-5 h-5" />
          Account
        </h3>
        <div className="card divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Account Name</p>
              <p className="text-sm text-slate-500">John Doe</p>
            </div>
            <button className="btn btn-secondary text-sm">Change Name</button>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Logout</p>
              <p className="text-sm text-slate-500">Sign out of your account</p>
            </div>
            <button className="btn btn-secondary text-red-600 hover:bg-red-50 text-sm">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
          <div className="p-4 flex items-center justify-between bg-red-50/50 dark:bg-red-950/10">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-slate-500">Permanently remove all your data</p>
            </div>
            <button className="btn btn-danger text-sm">Delete Account</button>
          </div>
        </div>
      </section>

      {/* Storage Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Database className="w-5 h-5" />
          Storage
        </h3>
        <div className="card p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Usage Stats</span>
              <span className="font-medium">2.4 GB / 5 GB</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '48%' }}></div>
            </div>
          </div>
          <button className="btn btn-secondary w-full text-sm">
            <RefreshCw className="w-4 h-4" />
            Clear Cache
          </button>
        </div>
      </section>

      {/* Notifications Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">
          <Bell className="w-5 h-5" />
          Notifications
        </h3>
        <div className="card divide-y divide-slate-100 dark:divide-slate-800">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Reminder Toggles</p>
              <p className="text-sm text-slate-500">Get reminders for your tasks</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.reminders}
                onChange={() => setNotifications({...notifications, reminders: !notifications.reminders})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-slate-500">Allow desktop push notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notifications.push}
                onChange={() => setNotifications({...notifications, push: !notifications.push})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-400">
          {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          Appearance
        </h3>
        <div className="card p-4 flex items-center justify-between">
          <div>
            <p className="font-medium">Dark / Light Mode</p>
            <p className="text-sm text-slate-500">Switch between light and dark themes</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="btn btn-secondary"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </section>
    </div>
  );
};
