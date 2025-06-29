
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CollegeSelector } from "@/components/auth/CollegeSelector";

interface SignupFormProps {
  fullName: string;
  setFullName: (name: string) => void;
  profileName: string;
  setProfileName: (name: string) => void;
  selectedCollegeId: string;
  setSelectedCollegeId: (id: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  loading: boolean;
  magicLinkLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onMagicLink: (e: React.FormEvent) => void;
}

export const SignupForm = ({
  fullName,
  setFullName,
  profileName,
  setProfileName,
  selectedCollegeId,
  setSelectedCollegeId,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  magicLinkLoading,
  onSubmit,
  onMagicLink,
}: SignupFormProps) => {
  return (
    <div className="space-y-4">
      {/* Magic Link Signup Form */}
      <form onSubmit={onMagicLink} className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <Label htmlFor="profileName">Profile Name</Label>
          <Input
            id="profileName"
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            required
            placeholder="Choose a profile name"
          />
        </div>
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
        <CollegeSelector
          selectedCollegeId={selectedCollegeId}
          onCollegeChange={setSelectedCollegeId}
          required
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={magicLinkLoading || loading}
          variant="default"
        >
          {magicLinkLoading ? "Sending Link..." : "Sign up with Magic Link"}
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

      {/* Password Signup Form */}
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
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || magicLinkLoading}
          variant="outline"
        >
          {loading ? "Please wait..." : "Sign up with Password"}
        </Button>
      </form>
    </div>
  );
};
