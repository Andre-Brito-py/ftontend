import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SuperAdminLayout from './layout/SuperAdminLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Stores from './pages/Stores.jsx'
import Users from './pages/Users.jsx'
import ApiManagement from './pages/ApiManagement.jsx'
import Analytics from './pages/Analytics.jsx'
import Settings from './pages/Settings.jsx'
import Logs from './pages/Logs.jsx'
import FinancialManagement from './pages/FinancialManagement.jsx'

export default function App() {
  return (
    <SuperAdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lojas" element={<Stores />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/apis" element={<ApiManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/config" element={<Settings />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/financeiro" element={<FinancialManagement />} />
      </Routes>
    </SuperAdminLayout>
  )
}