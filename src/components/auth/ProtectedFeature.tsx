
import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

interface ProtectedFeatureProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedFeature: React.FC<ProtectedFeatureProps> = ({ 
  feature, 
  children, 
  fallback 
}) => {
  const { canAccess } = useAppContext();

  if (!canAccess(feature)) {
    return fallback || (
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this feature. Contact your administrator if you need access.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

export default ProtectedFeature;
