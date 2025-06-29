
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
  magicLinkLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onMagicLink: (e: React.FormEvent) => void;
}

export const LoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  magicLinkLoading,
  onSubmit,
  onForgotPassword,
  onMagicLink,
}: LoginFormProps) => {
  return (
    <div className="space-y-4">
      {/* Magic Link Form */}
      <form onSubmit={onMagicLink} className="space-y-4">
        <div>
          <Label htmlFor="email">College/University Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your.name@your-college.edu"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={magicLinkLoading || loading}
          variant="default"
        >
          {magicLinkLoading ? "Sending Link..." : "Sign in with Magic Link"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with password
          </span>
        </div>
      </div>

      {/* Password Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || magicLinkLoading}
          variant="outline"
        >
          {loading ? "Please wait..." : "Sign in with Password"}
        </Button>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot your password?
          </button>
        </div>
      </form>
    </div>
  );
};
