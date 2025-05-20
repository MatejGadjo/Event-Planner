import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../Firebase/firebase';

const ProtectedRoute = ({ children }) => {
    if (!auth.currentUser) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute; 