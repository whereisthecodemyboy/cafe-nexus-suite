
import React, { ReactNode } from 'react';
import { useAppContext } from '@/contexts/SupabaseAppContext';
import SubscriptionExpired from '@/components/auth/SubscriptionExpired';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { currentUser, isCafeSubscriptionActive } = useAppContext();
  
  // Check if user is logged in and subscription is active
  if (currentUser && currentUser.role !== 'superAdmin' && !isCafeSubscriptionActive()) {
    return <SubscriptionExpired />;
  }

  return <>{children}</>;
};

export default AppLayout;
