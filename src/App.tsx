import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminDashboard } from './components/AdminDashboard';
import { SearchPage } from './components/SearchPage';
import { LoginPage } from './components/LoginPage';
import { useAuthStore } from './store/authStore';

export default function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            user?.role === 'ADMIN' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}