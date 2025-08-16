import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Dashboard } from '../modules/Dashboard';

export function DashboardPage({ onSignOut }) {
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await onSignOut();
    navigate('/');
  };

  return (
    <Dashboard user={session?.user} onSignOut={handleSignOut} />
  );
}
