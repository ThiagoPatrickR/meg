import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar/Sidebar';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Gifts from './pages/Gifts/Gifts';
import Categories from './pages/Categories/Categories';
import RSVPList from './pages/RSVPList/RSVPList';
import MessagesList from './pages/MessagesList/MessagesList';
import Payments from './pages/Payments/Payments';
import ChatbotConfig from './pages/ChatbotConfig/ChatbotConfig';
import Settings from './pages/Settings/Settings';
import './styles/global.css';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Clone children para passar onMenuClick */}
      {React.Children.map(children, child =>
        React.cloneElement(child, { onMenuClick: () => setSidebarOpen(true) })
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <PrivateRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/gifts" element={
            <PrivateRoute>
              <AdminLayout>
                <Gifts />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/categories" element={
            <PrivateRoute>
              <AdminLayout>
                <Categories />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/rsvp" element={
            <PrivateRoute>
              <AdminLayout>
                <RSVPList />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/messages" element={
            <PrivateRoute>
              <AdminLayout>
                <MessagesList />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/payments" element={
            <PrivateRoute>
              <AdminLayout>
                <Payments />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/chatbot" element={
            <PrivateRoute>
              <AdminLayout>
                <ChatbotConfig />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="/settings" element={
            <PrivateRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
