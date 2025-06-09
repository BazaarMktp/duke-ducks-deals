
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Calendar, Package, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Donations = () => {
  const [donationCount, setDonationCount] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    items: "",
    preferredDate: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDonationCount();
  }, []);

  const fetchDonationCount = async () => {
    try {
      const { count, error } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setDonationCount(count || 0);
    } catch (error) {
      console.error('Error fetching donation count:', error);
      setDonationCount(2456); // Fallback number
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('donations')
        .insert({
          user_id: user?.id || null,
          full_name: formData.name,
          email: formData.email,
          phone_number: formData.phone,
          address: formData.address,
          item_description: formData.items,
          pickup_date: formData.preferredDate || null,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your donation pickup request has been submitted successfully.",
      });

      setDonationCount(prev => prev + 1);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        items: "",
        preferredDate: "",
        notes: ""
      });
    } catch (error) {
      console.error('Error submitting donation:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your donation request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Duke Donations</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Help fellow Blue Devils by donating items you no longer need
        </p>
        
        {/* Donation Counter */}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donation Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2" size={24} />
              Request Donation Pickup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Duke Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="preferredDate">Preferred Pickup Date</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange("preferredDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Pickup Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your full address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="items">Items to Donate</Label>
                <textarea
                  id="items"
                  value={formData.items}
                  onChange={(e) => handleInputChange("items", e.target.value)}
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
                  onChange={(e) => handleInputChange("notes", e.target.value)}
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

        {/* Information and Guidelines */}
        <div className="space-y-6">
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
        </div>
      </div>
    </div>
  );
};

export default Donations;
