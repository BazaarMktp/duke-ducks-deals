
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const EmailValidation = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const [isResending, setIsResending] = useState(false);
  const { resendConfirmation } = useAuth();
  const { toast } = useToast();

  const handleResendEmail = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "No email address found. Please try signing up again.",
        variant: "destructive",
      });
      return;
    }

    setIsResending(true);
    try {
      const { error } = await resendConfirmation(email);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Confirmation email resent! Please check your inbox.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend confirmation email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            We've sent a verification link to{" "}
            {email && <span className="font-medium">{email}</span>}. 
            Please check your email and click the link to verify your account.
          </p>
          <p className="text-sm text-gray-500">
            Don't see the email? Check your spam folder or click the button below to resend.
          </p>
          
          <div className="space-y-3 pt-4">
            <Button 
              onClick={handleResendEmail}
              disabled={isResending || !email}
              className="w-full"
              variant="outline"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Resending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Confirmation Email
                </>
              )}
            </Button>
            
            <Link to="/">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailValidation;
