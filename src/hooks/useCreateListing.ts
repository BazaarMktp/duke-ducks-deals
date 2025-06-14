
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type ListingFormData = {
  title: string;
  description: string;
  price: string;
  location: string;
  category: 'marketplace' | 'housing' | 'services';
  listingType: 'offer' | 'wanted';
  housingType: string;
  images: string[];
};

export const useCreateListing = () => {
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "marketplace",
    listingType: "offer",
    housingType: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('college_id')
        .eq('id', user.id)
        .single();
      
      if (profileError || !profile?.college_id) {
        toast.error("Could not verify your college association. Please contact support if this issue persists.");
        setLoading(false);
        return;
      }

      const insertData: any = {
        user_id: user.id,
        college_id: profile.college_id,
        title: formData.title,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        category: formData.category,
        listing_type: formData.listingType,
        location: formData.location || null,
        images: formData.images.length > 0 ? formData.images : null,
      };

      if (formData.category === 'housing' && formData.housingType) {
        insertData.housing_type = formData.housingType;
      }

      const { error } = await supabase
        .from('listings')
        .insert(insertData);

      if (error) throw error;

      const actionText = formData.listingType === 'wanted' ? 'request' : 'listing';
      toast.success(`Your ${formData.category} ${actionText} has been posted successfully.`);
      navigate('/my-listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleInputChange,
    handleImagesChange,
    handleSubmit,
    navigate,
  };
};
