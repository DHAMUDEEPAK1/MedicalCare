import { useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

export default function NotFoundRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Redirect removed routes (like /locate) to /home
    navigate({ to: '/home', replace: true });
  }, [navigate, location]);

  return null;
}
