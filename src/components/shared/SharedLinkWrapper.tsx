
import React from 'react';
import { useSharedLinkAccess } from '@/hooks/useSharedLinkAccess';
import { SharedLinkExpired } from './SharedLinkExpired';
import { SharedLinkBanner } from './SharedLinkBanner';

interface SharedLinkWrapperProps {
  children: React.ReactNode;
}

export const SharedLinkWrapper: React.FC<SharedLinkWrapperProps> = ({ children }) => {
  const { isSharedLink, isExpired, expiryDate } = useSharedLinkAccess();

  // If not a shared link, render normally
  if (!isSharedLink) {
    return <>{children}</>;
  }

  // If shared link is expired, show expiry message
  if (isExpired) {
    return <SharedLinkExpired />;
  }

  // If shared link is valid, show with banner
  return (
    <>
      <SharedLinkBanner expiryDate={expiryDate} />
      {children}
    </>
  );
};
