import { Navigate, Route, Routes } from 'react-router';

import './App.css';
import TicketsPage from './pages/TicketsPage.jsx';
import TicketFormPage from './pages/TicketFormPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppShell from './components/AppShell.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import DocsPage from './pages/DocsPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/docs" element={<DocsPage />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/new" element={<TicketFormPage />} />
        <Route path="tickets/:ticketId/edit" element={<TicketFormPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
