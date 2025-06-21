
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuthForm = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.from !== 'signup');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [profileName, setProfileName] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
  
  // Set form mode based on navigation state
  useEffect(() => {
    if (location.state?.from === 'signup') {
      setIsLogin(false);
    } else if (location.state?.from === 'login') {
      setIsLogin(true);
    }
  }, [location.state]);

  // Auto-select college based on email domain
  useEffect(() => {
    if (!isLogin && email && email.includes('@')) {
      const domain = email.substring(email.lastIndexOf('@') + 1);
      fetchCollegeByDomain(domain);
    }
  }, [email, isLogin]);

  const fetchCollegeByDomain = async (domain: string) => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id')
        .eq('domain', domain)
        .single();
      
      if (data) {
        setSelectedCollegeId(data.id);
      }
    } catch (error) {
      // College not found, user will need to select manually
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Logged in successfully!",
          });
          // Let React Router handle navigation smoothly
          navigate("/", { replace: true });
        }
      } else {
        // Validate password confirmation
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Validate college selection
        if (!selectedCollegeId) {
          toast({
            title: "Error",
            description: "Please select your college/university",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { error } = await signUp(email, password, fullName, profileName);
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          // Redirect to email validation page with email
          navigate("/email-validation", { state: { email }, replace: true });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/auth?mode=reset`,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Password reset email sent! Check your inbox for instructions.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  return {
    isLogin,
    setIsLogin,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fullName,
    setFullName,
    profileName,
    setProfileName,
    selectedCollegeId,
    setSelectedCollegeId,
    loading,
    resetLoading,
    handleSubmit,
    handleForgotPassword,
  };
};
