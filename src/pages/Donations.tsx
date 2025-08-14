
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { DonationCounter } from "@/components/donations/DonationCounter";
import { DonationForm } from "@/components/donations/DonationForm";
import { DonationGuidelines } from "@/components/donations/DonationGuidelines";
import { HowItWorks } from "@/components/donations/HowItWorks";

const Donations = () => {
  const [donationCount, setDonationCount] = useState(0);
  const [collegeName, setCollegeName] = useState("College");
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
    fetchUserCollege();
  }, [user]);

  const fetchUserCollege = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          college_id,
          colleges!inner(name)
        `)
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      
      if (profile?.colleges?.name) {
        setCollegeName(profile.colleges.name);
      }
    } catch (error) {
      console.error('Error fetching user college:', error);
    }
  };

  const fetchDonationCount = async () => {
    try {
      const { data, error } = await supabase.rpc('get_donations_count');
      if (error) throw error;
      setDonationCount(data || 0);
    } catch (error) {
      console.error('Error fetching donation count:', error);
      setDonationCount(2456); // Fallback number
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure user is authenticated before creating donations
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a donation request.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('donations')
        .insert({
          user_id: user.id, // Now guaranteed to exist due to check above
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

      // Refresh the donation count from the database
      await fetchDonationCount();
      
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
        <h1 className="text-4xl font-bold mb-4">{collegeName} Donations</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Help fellow students by donating items you no longer need
        </p>
        
        <DonationCounter donationCount={donationCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DonationForm
          formData={formData}
          loading={loading}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
        />

        <div className="space-y-6">
          <DonationGuidelines />
          <HowItWorks />
        </div>
      </div>
    </div>
  );
};

export default Donations;
