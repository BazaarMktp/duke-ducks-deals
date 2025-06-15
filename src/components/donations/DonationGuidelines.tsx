
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DonationGuidelines = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Donation Guidelines</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <h4 className="font-semibold">What we accept:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Clothing in good condition</li>
          <li>Books and textbooks</li>
          <li>Electronics (working condition)</li>
          <li>Furniture and home goods</li>
          <li>School supplies</li>
          <li>Sports equipment</li>
        </ul>
        
        <h4 className="font-semibold mt-4">What we don't accept:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Damaged or broken items</li>
          <li>Food items</li>
          <li>Personal documents</li>
          <li>Hazardous materials</li>
        </ul>
      </CardContent>
    </Card>
  );
};
