
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string, profileName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    console.log('Sign in result:', error ? error.message : 'Success');
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string, profileName: string) => {
    console.log('Attempting to sign up with:', email);
    
    // Validate college email or admin email
    const emailDomain = email.substring(email.lastIndexOf('@') + 1);
    const isAdminEmail = email === 'info@thebazaarapp.com';
    
    console.log('Email validation:', { emailDomain, isAdminEmail, email });
    
    if (!isAdminEmail) {
      const { data: college, error: collegeError } = await supabase
        .from('colleges')
        .select('id')
        .eq('domain', emailDomain)
        .single();
      
      if (collegeError || !college) {
        const errorMessage = 'Please use an email address from a supported college/university.';
        console.log('Email validation failed:', errorMessage, { emailDomain });
        return { error: { message: errorMessage } };
      }
    }

    const redirectUrl = `${window.location.origin}/`;
    console.log('Using redirect URL:', redirectUrl);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          profile_name: profileName,
        },
      },
    });
    
    console.log('Sign up result:', error ? error.message : 'Success');
    return { error };
  };

  const signOut = async () => {
    console.log('Signing out...');
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
