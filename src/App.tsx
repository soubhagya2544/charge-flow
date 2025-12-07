import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import UserPanel from './pages/UserPanel';
import APIUserPanel from './pages/APIUserPanel';
import B2BBillingPanel from './components/b2b/B2BBillingPanel';
import Login from './pages/Login';
import SecureAdminLogin from './pages/SecureAdminLogin';
import LandingPage from './pages/LandingPage';
import SystemStatus from './components/SystemStatus';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    // Check if we're on admin secure portal route
    if (window.location.pathname === '/admin-secure-portal') {
      setIsAdminRoute(true);
    }
  }, []);

  const handleLogin = (role: string, email: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setUserEmail('');
    setIsAdminRoute(false);
  };

  // Show secure admin login for /admin-secure-portal route
  if (!isAuthenticated && window.location.pathname === '/admin-secure-portal') {
    return <SecureAdminLogin onLogin={handleLogin} />;
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/admin-secure-portal" element={<SecureAdminLogin onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={
          userRole === 'admin' ? <Navigate to="/admin" /> :
          userRole === 'api_user' ? <Navigate to="/api" /> :
          userRole === 'b2b_user' ? <Navigate to="/b2b-billing" /> :
          <Navigate to="/user" />
        } />
        <Route path="/admin" element={<AdminDashboard userEmail={userEmail} onLogout={handleLogout} />} />
        <Route path="/admin-secure-portal" element={<AdminDashboard userEmail={userEmail} onLogout={handleLogout} />} />
        <Route path="/user" element={<UserPanel onLogout={handleLogout} userEmail={userEmail} />} />
        <Route path="/api" element={<APIUserPanel userEmail={userEmail} />} />
        <Route path="/b2b-billing" element={<B2BBillingPanel userEmail={userEmail} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <SystemStatus />
    </>
  );
}

export default App;
