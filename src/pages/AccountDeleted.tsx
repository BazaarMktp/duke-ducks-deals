
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AccountDeleted = () => {
  const [feedback, setFeedback] = useState("");
  const [reason, setReason] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    "Not using the app anymore",
    "Found a better alternative",
    "Privacy concerns",
    "Too many notifications",
    "Technical issues",
    "Other"
  ];

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true);
    try {
      // Create a support ticket for the feedback
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: null, // User is deleted, so no user_id
          subject: 'Account Deletion Feedback',
          message: `Reason: ${reason}\n\nAdditional feedback: ${feedback}`,
          priority: 'low',
          status: 'open'
        });

      if (error) throw error;

      setFeedbackSubmitted(true);
      toast.success("Thank you for your feedback!");
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Failed to submit feedback, but your account has been deleted.");
      setFeedbackSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (feedbackSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Thank You!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Your account has been successfully deleted and your feedback has been received. 
              We appreciate you taking the time to help us improve.
            </p>
            <p className="text-sm text-gray-500">
              If you change your mind, you're always welcome back!
            </p>
            <Link to="/">
              <Button className="w-full mt-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Homepage
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Account Deleted</CardTitle>
          <p className="text-gray-600 mt-2">
            Your account has been successfully deleted. We'd love to hear why you left.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">
              What was your main reason for deleting your account?
            </Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {reasons.map((reasonOption) => (
                <div key={reasonOption} className="flex items-center space-x-2">
                  <RadioGroupItem value={reasonOption} id={reasonOption} />
                  <Label htmlFor={reasonOption} className="cursor-pointer">
                    {reasonOption}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="feedback" className="text-base font-medium mb-2 block">
              Additional feedback (optional)
            </Label>
            <Textarea
              id="feedback"
              placeholder="Tell us more about your experience or suggestions for improvement..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleSubmitFeedback}
              disabled={!reason || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
            
            <Link to="/">
              <Button variant="outline" className="w-full">
                Skip Feedback
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountDeleted;
