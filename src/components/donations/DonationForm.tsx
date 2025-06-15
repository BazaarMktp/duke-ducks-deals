
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  items: string;
  preferredDate: string;
  notes: string;
}

interface DonationFormProps {
  formData: FormData;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (field: string, value: string) => void;
}

export const DonationForm = ({ formData, loading, onSubmit, onInputChange }: DonationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="mr-2" size={24} />
          Request Donation Pickup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange("email", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="preferredDate">Preferred Pickup Date</Label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => onInputChange("preferredDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Pickup Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => onInputChange("address", e.target.value)}
              placeholder="Enter your full address"
              required
            />
          </div>

          <div>
            <Label htmlFor="items">Items to Donate</Label>
            <textarea
              id="items"
              value={formData.items}
              onChange={(e) => onInputChange("items", e.target.value)}
              className="w-full p-2 border border-input rounded-md"
              rows={3}
              placeholder="Describe the items you'd like to donate..."
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onInputChange("notes", e.target.value)}
              className="w-full p-2 border border-input rounded-md"
              rows={2}
              placeholder="Any special instructions or notes..."
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting..." : "Schedule Pickup"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
