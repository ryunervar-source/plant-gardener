import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import HomePage from './pages/HomePage.jsx'
import PlantDetailPage from './pages/PlantDetailPage.jsx'
import PlantEditPage from './pages/PlantEditPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

export default function App() {
  return (
    <div className="min-h-[100dvh] bg-sand-50">
      <Header />
      <main className="mx-auto max-w-xl px-4 pb-24 pt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/plant/new" element={<PlantEditPage />} />
          <Route path="/plant/:id" element={<PlantDetailPage />} />
          <Route path="/plant/:id/edit" element={<PlantEditPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
