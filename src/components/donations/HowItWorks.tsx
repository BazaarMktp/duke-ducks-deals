
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const HowItWorks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2" size={20} />
          How it Works
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
          <div>
            <p className="font-medium">Submit Request</p>
            <p className="text-sm text-muted-foreground">Fill out the donation form with your details</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
          <div>
            <p className="font-medium">Confirmation</p>
            <p className="text-sm text-muted-foreground">We'll confirm your pickup within 24 hours</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
          <div>
            <p className="font-medium">Pickup</p>
            <p className="text-sm text-muted-foreground">Our team will collect your items on the scheduled date</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
          <div>
            <p className="font-medium">Impact</p>
            <p className="text-sm text-muted-foreground">Your items help fellow students and local community</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
