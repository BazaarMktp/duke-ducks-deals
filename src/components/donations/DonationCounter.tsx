
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Heart } from "lucide-react";

interface DonationCounterProps {
  donationCount: number;
}

export const DonationCounter = ({ donationCount }: DonationCounterProps) => {
  return (
    <Card className="max-w-md mx-auto bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-6 text-center">
        <Gift className="mx-auto mb-4 text-blue-600" size={48} />
        <p className="text-3xl font-bold text-blue-600">{donationCount.toLocaleString()}</p>
        <p className="text-muted-foreground">Total Donations Made</p>
        <p className="text-sm text-muted-foreground mt-2">
          <Heart className="inline mr-1" size={16} />
          Making a difference together
        </p>
      </CardContent>
    </Card>
  );
};
