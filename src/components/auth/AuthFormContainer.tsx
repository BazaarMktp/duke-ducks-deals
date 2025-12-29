
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";

interface AuthFormContainerProps {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  fullName: string;
  setFullName: (name: string) => void;
  profileName: string;
  setProfileName: (name: string) => void;
  selectedCollegeId: string;
  setSelectedCollegeId: (id: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
}

export const AuthFormContainer = ({
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
  onSubmit,
  onForgotPassword,
}: AuthFormContainerProps) => {
  console.log('AuthFormContainer rendering:', { isLogin, loading });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isLogin ? "Sign In" : "Create Account"}
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Welcome back to Devils Marketplace" : "Join Devils Marketplace"}
          </p>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              onSubmit={onSubmit}
              onForgotPassword={onForgotPassword}
            />
          ) : (
            <SignupForm
              fullName={fullName}
              setFullName={setFullName}
              profileName={profileName}
              setProfileName={setProfileName}
              selectedCollegeId={selectedCollegeId}
              setSelectedCollegeId={setSelectedCollegeId}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              loading={loading}
              onSubmit={onSubmit}
            />
          )}
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-gray-600 hover:underline">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
