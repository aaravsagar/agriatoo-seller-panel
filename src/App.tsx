import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Login from './components/Auth/Login';
import SellerDashboard from './components/Seller/SellerDashboard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-grow">
        <Routes>
          {/* Redirect root to seller or login */}
          <Route path="/" element={<Navigate to={user ? '/seller' : '/login'} replace />} />
          <Route path="/login" element={<Login />} />

          {/* Seller Protected Routes */}
          <Route
            path="/seller/*"
            element={
              <ProtectedRoute requiredRole="seller">
                <SellerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
