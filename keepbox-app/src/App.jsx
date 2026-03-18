import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import CategoryView from './pages/CategoryView'
import FolderView from './pages/FolderView'
import SearchPage from './pages/SearchPage'
import ArchivePage from './pages/ArchivePage'
import ReminderPage from './pages/ReminderPage'
import TrashPage from './pages/TrashPage'
import Settings from './pages/Settings'
import HelpFeedback from './pages/HelpFeedback'
import { getSettings } from './services/storage'

function ProtectedLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  useEffect(() => {
    const { theme } = getSettings()
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
        <Route path="/category/:type" element={<ProtectedLayout><CategoryView /></ProtectedLayout>} />
        <Route path="/folder/:id" element={<ProtectedLayout><FolderView /></ProtectedLayout>} />
        <Route path="/search" element={<ProtectedLayout><SearchPage /></ProtectedLayout>} />
        <Route path="/archive" element={<ProtectedLayout><ArchivePage /></ProtectedLayout>} />
        <Route path="/reminders" element={<ProtectedLayout><ReminderPage /></ProtectedLayout>} />
        <Route path="/trash" element={<ProtectedLayout><TrashPage /></ProtectedLayout>} />
        <Route path="/settings" element={<ProtectedLayout><Settings /></ProtectedLayout>} />
        <Route path="/help" element={<ProtectedLayout><HelpFeedback /></ProtectedLayout>} />
      </Routes>
    </BrowserRouter>
  )
}
