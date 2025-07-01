
import React from 'react';
import { Navigate } from 'react-router-dom';

// Circle functionality has been deprecated in favor of professional networking connections
export default function Circle() {
  return <Navigate to="/network" replace />;
}
