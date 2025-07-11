import { CssBaseline } from '@mui/material';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';

// Pages
import AdminDashboard from './pages/AdminDashboard';
import BookingRequest from './pages/BookingRequest';
import EditProfile from './pages/EditProfile';
import Home from './pages/Home';
import Login from './pages/Login';
import NannyDashboard from './pages/NannyDashboard';
import NannyDetails from './pages/NannyDetails';
import NannyProfileForm from './pages/NannyProfileForm';
import NannyProfileSetup from './pages/NannyProfileSetup';
import NannySearch from './pages/NannySearch';
import ParentDashboard from './pages/ParentDashboard';
import Register from './pages/Register';

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    // Aggressive scroll to top approach
    window.scrollTo(0, 0);
    
    // Additional attempt after a slight delay
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });
    }, 0);
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Restricted Route Component
const RestrictedRoute = ({ children, disallowedRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Non-authenticated users can access the route
  if (!isAuthenticated) {
    return children;
  }
  
  // Redirect users with disallowed role
  if (disallowedRole && user.role === disallowedRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <CssBaseline />
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/nannies" element={
            <RestrictedRoute disallowedRole="nanny">
              <NannySearch />
            </RestrictedRoute>
          } />
          <Route path="/nannies/:nannyId" element={<NannyDetails />} />
          
          {/* Protected Parent Routes */}
          <Route 
            path="/parent/dashboard" 
            element={
              <ProtectedRoute requiredRole="parent">
                <ParentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking/:nannyId" 
            element={
              <ProtectedRoute requiredRole="parent">
                <BookingRequest />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Nanny Routes */}
          <Route 
            path="/nanny/dashboard" 
            element={
              <ProtectedRoute requiredRole="nanny">
                <NannyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/nanny/profile/setup" 
            element={
              <ProtectedRoute requiredRole="nanny">
                <NannyProfileSetup />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/nanny/profile/create" 
            element={
              <ProtectedRoute requiredRole="nanny">
                <NannyProfileForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/nanny/profile/edit/:nannyId" 
            element={
              <ProtectedRoute requiredRole="nanny">
                <NannyProfileForm />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Common Protected Routes */}
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
