
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to auth page since this is now the entry point for authentication
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
