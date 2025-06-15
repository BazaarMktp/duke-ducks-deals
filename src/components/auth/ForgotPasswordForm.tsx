
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ForgotPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  resetLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export const ForgotPasswordForm = ({
  email,
  setEmail,
  resetLoading,
  onSubmit,
  onBack,
}: ForgotPasswordFormProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Reset Password</CardTitle>
          <p className="text-center text-sm text-muted-foreground">
            Enter your email address and we'll send you a reset link
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="reset-email">College/University Email</Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.name@your-college.edu"
              />
            </div>
            <Button type="submit" className="w-full" disabled={resetLoading}>
              {resetLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Sign In
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
