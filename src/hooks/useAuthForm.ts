
import { useAuthState } from "./useAuthState";
import { useCollegeAutoSelect } from "./useCollegeAutoSelect";
import { useAuthActions } from "./useAuthActions";

export const useAuthForm = () => {
  const {
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
    setLoading,
    resetLoading,
    setResetLoading,
  } = useAuthState();

  const { handleLogin, handleSignup, handleForgotPassword } = useAuthActions();

  // Auto-select college based on email domain
  useCollegeAutoSelect(email, isLogin, setSelectedCollegeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await handleLogin(email, password);
      } else {
        await handleSignup(email, password, confirmPassword, fullName, profileName, selectedCollegeId);
      }
    } catch (error) {
      console.error('Auth form submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    
    try {
      await handleForgotPassword(email);
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
    handleForgotPassword: handleForgotPasswordSubmit,
  };
};
