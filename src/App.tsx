import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { DatesProvider } from '@mantine/dates';
import { AppShell } from '@mantine/core';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import EventCreate from './pages/EventCreate';
import FriendSearch from './pages/FriendSearch';
import 'dayjs/locale/tr';

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

// Public Route component (redirect to home if logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }
  
  return user ? <Navigate to="/" replace /> : <>{children}</>;
};

function AppContent() {
  // eslint-disable-next-line no-empty-pattern
  const { } = useAuth();

  return (
    <AppShell
      header={{ height: 60 }}
      p="md"
    >
      <AppShell.Header>
        <Navbar />
      </AppShell.Header>
      
      <AppShell.Main className="flex flex-col min-h-screen">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-event" 
              element={
                <ProtectedRoute>
                  <EventCreate />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <FriendSearch />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}

function App() {
  return (
    <MantineProvider>
      <DatesProvider settings={{ locale: 'tr' }}>
        <Notifications />
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </DatesProvider>
    </MantineProvider>
  );
}

export default App;
