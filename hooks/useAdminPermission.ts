import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AdminPermission, useAuth } from '../contexts/AuthContext';

export const useAdminPermission = (permission: AdminPermission) => {
  const auth = useAuth();
  const router = useRouter();
  const allowed = auth.hasPermission(permission);

  useEffect(() => {
    if (auth.loading) return;
    if (!auth.user) {
      router.replace('/admin/login');
    } else if (!allowed) {
      router.replace('/admin');
    }
  }, [auth.loading, auth.user, allowed, router]);

  return { ...auth, allowed };
};
