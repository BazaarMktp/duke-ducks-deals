
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const useAuthState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLogin, setIsLogin] = useState(location.state?.from !== 'signup');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [profileName, setProfileName] = useState("");
  const [selectedCollegeId, setSelectedCollegeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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
    setLoading,
    resetLoading,
    setResetLoading,
  };
};
