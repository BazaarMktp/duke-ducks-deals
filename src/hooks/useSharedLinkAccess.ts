
import { useState, useEffect } from 'react';

interface SharedLinkAccess {
  isSharedLink: boolean;
  isExpired: boolean;
  expiryDate: Date;
}

export const useSharedLinkAccess = (): SharedLinkAccess => {
  const [accessInfo, setAccessInfo] = useState<SharedLinkAccess>({
    isSharedLink: false,
    isExpired: false,
    expiryDate: new Date('2025-07-04T17:00:00-04:00') // July 4th, 5pm EST
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedToken = urlParams.get('shared_token');
    
    if (sharedToken) {
      const now = new Date();
      const expiryDate = new Date('2025-07-04T17:00:00-04:00'); // July 4th, 5pm EST
      const isExpired = now > expiryDate;
      
      setAccessInfo({
        isSharedLink: true,
        isExpired,
        expiryDate
      });
    }
  }, []);

  return accessInfo;
};
