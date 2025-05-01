
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InventoryIndex = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/inventory/stock-in', { replace: true });
  }, [navigate]);
  
  return <div>Redirecting to Stock In...</div>;
};

export default InventoryIndex;
