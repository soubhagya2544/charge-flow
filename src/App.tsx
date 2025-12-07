import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import SecureAdminLogin from './pages/SecureAdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserPanel from './pages/UserPanel';
import APIUserPanel from './pages/APIUserPanel';
import B2BBillingPanel from './components/b2b/B2BBillingPanel';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  const handleLogin = (role: string, email: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setUserEmail('');
  };

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/admin-secure-portal" element={
          isAuthenticated && userRole === 'admin' ? <Navigate to="/dashboard" /> : <SecureAdminLogin onLogin={handleLogin} />
        } />
        <Route path="/dashboard" element={
          !isAuthenticated ? <Navigate to="/login" /> :
          userRole === 'admin' ? <AdminDashboard userEmail={userEmail} onLogout={handleLogout} /> :
          userRole === 'api_user' ? <APIUserPanel userEmail={userEmail} /> :
          userRole === 'b2b_user' ? <B2BBillingPanel userEmail={userEmail} /> :
          <UserPanel onLogout={handleLogout} userEmail={userEmail} />
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
