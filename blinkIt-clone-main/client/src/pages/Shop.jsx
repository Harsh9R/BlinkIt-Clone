import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );
};

export default Shop; 