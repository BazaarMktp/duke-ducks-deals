
import { useState } from "react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { AuthFormContainer } from "@/components/auth/AuthFormContainer";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

const Auth = () => {
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

  if (showForgotPassword) {
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
