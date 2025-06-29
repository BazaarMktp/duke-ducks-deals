
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAuthActions = () => {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    console.log('Attempting login with email:', email);
    const { error } = await signIn(email, password);
    
    if (error) {
      console.log('Login error:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } else {
      console.log('Login successful');
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      navigate("/", { replace: true });
      return true;
    }
  };

  const handleSignup = async (
    email: string, 
    password: string, 
    confirmPassword: string, 
    fullName: string, 
    profileName: string, 
    selectedCollegeId: string
  ) => {
    console.log('Attempting signup with email:', email);
    
    // Validate password confirmation
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    // Validate college selection
    if (!selectedCollegeId) {
      toast({
        title: "Error",
        description: "Please select your college/university",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await signUp(email, password, fullName, profileName);
    
    if (error) {
      console.log('Signup error:', error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } else {
      console.log('Signup successful, redirecting to email validation');
      navigate("/email-validation", { state: { email }, replace: true });
      return true;
    }
  };

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }

    console.log('Attempting password reset for email:', email);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#/auth?mode=reset`,
      });

      if (error) {
        console.log('Password reset error:', error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        return false;
      } else {
        console.log('Password reset email sent successfully');
        toast({
          title: "Success",
          description: "Password reset email sent! Check your inbox for instructions.",
        });
        return true;
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleLogin,
    handleSignup,
    handleForgotPassword,
  };
};
