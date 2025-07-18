
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface PostingFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  housingType: string;
  images: string[];
  allowPickup: boolean;
  allowMeetOnCampus: boolean;
  allowDropOff: boolean;
}

interface UsePostingFormProps {
  category: 'marketplace' | 'housing' | 'services';
  listingType: 'offer' | 'wanted';
  onSuccess: () => void;
  onClose: () => void;
}

export const usePostingForm = ({ category, listingType, onSuccess, onClose }: UsePostingFormProps) => {
  const [formData, setFormData] = useState<PostingFormData>({
    title: "",
    description: "",
    price: "",
    location: "",
    housingType: "",
    images: [],
    allowPickup: false,
    allowMeetOnCampus: false,
    allowDropOff: false,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation for required fields
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Title is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Error",
        description: "Description is required.",
        variant: "destructive",
      });
      return;
    }

    if (formData.images.length === 0) {
      toast({
        title: "Error",
        description: "At least one image is required.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.price) {
      toast({
        title: "Error",
        description: "Price is required.",
        variant: "destructive",
      });
      return;
    }

    // Validation for marketplace items
    if (category === 'marketplace' && listingType === 'offer' && !formData.allowPickup && !formData.allowMeetOnCampus && !formData.allowDropOff) {
      toast({
        title: "Transaction Method Required",
        description: "Please select at least one transaction method.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const insertData: any = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        category,
        location: formData.location || null,
        images: formData.images.length > 0 ? formData.images : null,
        listing_type: listingType,
      };

      // Add transaction methods for marketplace items
      if (category === 'marketplace') {
        insertData.allow_pickup = formData.allowPickup;
        insertData.allow_meet_on_campus = formData.allowMeetOnCampus;
        insertData.allow_drop_off = formData.allowDropOff;
      }

      if (category === 'housing' && formData.housingType) {
        insertData.housing_type = formData.housingType;
      }

      const { error } = await supabase
        .from('listings')
        .insert(insertData);

      if (error) throw error;

      const actionText = listingType === 'wanted' ? 'request' : 'listing';
      toast({
        title: "Success!",
        description: `Your ${category} ${actionText} has been posted successfully.`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        title: "Error",
        description: `Failed to create ${listingType === 'wanted' ? 'request' : 'listing'}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFormTitle = () => {
    if (listingType === 'wanted') {
      return `Post ${category === 'marketplace' ? 'Item' : category === 'housing' ? 'Housing' : 'Service'} Request`;
    }
    return `Post New ${category === 'marketplace' ? 'Item' : category === 'housing' ? 'Housing' : 'Service'}`;
  };

  const getPricePlaceholder = () => {
    if (listingType === 'wanted') {
      return category === 'services' ? 'Budget per hour *' : category === 'housing' ? 'Budget per month *' : 'Budget *';
    }
    return category === 'services' ? 'Price per hour *' : category === 'housing' ? 'Price per month *' : 'Price *';
  };

  return {
    formData,
    loading,
    handleInputChange,
    handleImagesChange,
    handleSubmit,
    getFormTitle,
    getPricePlaceholder
  };
};
