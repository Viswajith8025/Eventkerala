import React from 'react';
import { Navigate } from 'react-router-dom';

// This is a simple protected route. 
// In a real app, you'd decode the JWT to check for 'admin' role.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // NOTE: For true security, the backend role check (authorize('admin')) handles the data protection.
  // Frontend protection is mainly for UX/Navigation.
  return children;
};

export default ProtectedRoute;
