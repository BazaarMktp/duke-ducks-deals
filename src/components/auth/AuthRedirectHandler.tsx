
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthRedirectHandlerProps {
  onAuthProcessing: (isProcessing: boolean) => void;
}

export const AuthRedirectHandler = ({ onAuthProcessing }: AuthRedirectHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(hash.replace('#', ''));
      
      // Check if this is an auth-related redirect
      const hasAuthParams = searchParams.get('access_token') || 
                           searchParams.get('type') === 'recovery' || 
                           searchParams.get('error');

      if (!hasAuthParams) return;

      console.log('Auth redirect detected, processing...');
      setIsProcessing(true);
      onAuthProcessing(true);

      if (searchParams.get('error')) {
        console.log('Auth error detected:', searchParams.get('error_description'));
        // Clear the error from URL after a short delay
        setTimeout(() => {
          window.history.replaceState({}, document.title, '/#/auth');
          setIsProcessing(false);
          onAuthProcessing(false);
        }, 100);
        return;
      }

      // Handle successful email confirmation or recovery
      if (searchParams.get('access_token') || searchParams.get('type') === 'recovery') {
        console.log('Auth success detected, waiting for session update...');
        
        // Wait for Supabase to process the session
        try {
          await supabase.auth.getSession();
          
          // Wait a bit longer to ensure auth state is updated
          setTimeout(() => {
            console.log('Session processed, redirecting to dashboard...');
            window.history.replaceState({}, document.title, '/#/');
            setIsProcessing(false);
            onAuthProcessing(false);
          }, 1000);
        } catch (error) {
          console.error('Error processing auth session:', error);
          setTimeout(() => {
            window.history.replaceState({}, document.title, '/#/');
            setIsProcessing(false);
            onAuthProcessing(false);
          }, 100);
        }
      }
    };

    handleAuthRedirect();
  }, [onAuthProcessing]);

  return null;
};
