
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import { UserRole } from './types';

const PrivateRoute: React.FC<{ children: React.ReactElement; role?: UserRole }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute role={UserRole.SELLER}>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute role={UserRole.ADMIN}>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
