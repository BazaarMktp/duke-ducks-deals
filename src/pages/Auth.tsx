
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthForm } from "@/hooks/useAuthForm";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
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
    resetLoading,
    handleSubmit,
    handleForgotPassword,
  } = useAuthForm();

  // Set signup mode based on URL parameter
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
  }, [searchParams, setIsLogin]);

  console.log('Auth component rendering:', { 
    isLogin, 
    showForgotPassword, 
    loading,
    email: email?.substring(0, 3) + '***', // Partially mask email for privacy
    hasFormData: !!(fullName || profileName)
  });

  if (showForgotPassword) {
    console.log('Rendering ForgotPasswordForm');
    return (
      <ForgotPasswordForm
        email={email}
        setEmail={setEmail}
        resetLoading={resetLoading}
        onSubmit={(e) => {
          handleForgotPassword(e);
          setShowForgotPassword(false);
        }}
        onBack={() => setShowForgotPassword(false)}
      />
    );
  }

  console.log('Rendering AuthFormContainer');
  return (
    <AuthFormContainer
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      fullName={fullName}
      setFullName={setFullName}
      profileName={profileName}
      setProfileName={setProfileName}
      selectedCollegeId={selectedCollegeId}
      setSelectedCollegeId={setSelectedCollegeId}
      loading={loading}
      onSubmit={handleSubmit}
      onForgotPassword={() => setShowForgotPassword(true)}
    />
  );
};

export default Auth;
