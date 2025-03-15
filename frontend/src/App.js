import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NannySearch from './pages/NannySearch';
import NannyDetails from './pages/NannyDetails';
import ParentDashboard from './pages/ParentDashboard';
import NannyDashboard from './pages/NannyDashboard';
import BookingRequest from './pages/BookingRequest';
import NannyProfileForm from './pages/NannyProfileForm';
import NannyProfileSetup from './pages/NannyProfileSetup';
import EditProfile from './pages/EditProfile';

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
      <Navbar />
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
      <Footer />
    </Router>
  );
}

export default App;
