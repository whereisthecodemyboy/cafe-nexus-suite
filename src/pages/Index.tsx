
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Index = () => {
  // Use Navigate component instead of useNavigate hook
  return <Navigate to="/login" replace />;
};

export default Index;
