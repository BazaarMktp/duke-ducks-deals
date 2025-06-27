
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AuthRedirectHandlerProps {
  onAuthProcessing: (isProcessing: boolean) => void;
}

export const AuthRedirectHandler = ({ onAuthProcessing }: AuthRedirectHandlerProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Check both hash and search params for auth tokens
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(hash.replace('#', ''));
      
      // Check if this is an auth-related redirect from either source
      const hasAuthParams = hashParams.get('access_token') || 
                           hashParams.get('type') === 'recovery' || 
                           hashParams.get('error') ||
                           searchParams.get('access_token') ||
                           searchParams.get('type') === 'recovery' ||
                           searchParams.get('error');

      if (!hasAuthParams) return;

      console.log('Auth redirect detected, processing...', { hash, search: window.location.search });
      setIsProcessing(true);
      onAuthProcessing(true);

      // Check for errors in either location
      const error = hashParams.get('error') || searchParams.get('error');
      const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');

      if (error) {
        console.log('Auth error detected:', errorDescription);
        // Clear the error from URL after a short delay
        setTimeout(() => {
          window.history.replaceState({}, document.title, '/');
          setIsProcessing(false);
          onAuthProcessing(false);
        }, 100);
        return;
      }

      // Handle successful email confirmation or recovery
      const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
      const type = hashParams.get('type') || searchParams.get('type');

      if (accessToken || type === 'recovery') {
        console.log('Auth success detected, processing session...');
        
        try {
          // Give Supabase time to process the tokens
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Get the current session to trigger auth state update
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          console.log('Session retrieved:', { session: !!session, error: sessionError });
          
          if (session) {
            console.log('User authenticated successfully, redirecting to home...');
            // Clear the URL parameters and redirect to home
            window.history.replaceState({}, document.title, '/');
            // Force a page reload to ensure clean state
            window.location.reload();
          } else {
            console.log('No session found, redirecting to auth...');
            window.history.replaceState({}, document.title, '/auth');
          }
        } catch (error) {
          console.error('Error processing auth session:', error);
          window.history.replaceState({}, document.title, '/auth');
        }
        
        setIsProcessing(false);
        onAuthProcessing(false);
      }
    };

    handleAuthRedirect();
  }, [onAuthProcessing]);

  return null;
};
