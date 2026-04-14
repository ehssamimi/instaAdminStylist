"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth';
import { removeToken } from '@/lib/jwt-utils';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated()) {
      removeToken();
      router.replace('/admin-login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated()) return null;

  return <>{children}</>;
};

export default PrivateRoute;
