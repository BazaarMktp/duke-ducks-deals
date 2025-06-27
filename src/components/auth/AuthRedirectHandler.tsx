
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

      console.log('Auth redirect detected, processing...', { hash });
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
        console.log('Auth success detected, processing session...');
        
        try {
          // Get the current session to trigger auth state update
          const { data: { session }, error } = await supabase.auth.getSession();
          console.log('Session retrieved:', { session: !!session, error });
          
          if (session) {
            console.log('User authenticated successfully, redirecting to home...');
            // Clear the URL parameters and redirect to home
            window.history.replaceState({}, document.title, '/');
            // Force a page reload to ensure clean state
            window.location.reload();
          } else {
            console.log('No session found, redirecting to auth...');
            window.history.replaceState({}, document.title, '/#/auth');
          }
        } catch (error) {
          console.error('Error processing auth session:', error);
          window.history.replaceState({}, document.title, '/#/auth');
        }
        
        setIsProcessing(false);
        onAuthProcessing(false);
      }
    };

    handleAuthRedirect();
  }, [onAuthProcessing]);

  return null;
};
