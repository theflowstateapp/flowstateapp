import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Redirect = ({ to }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate(to, { replace: true });
  }, [navigate, to]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Redirect;
