
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useListingPreferences } from "./useListingPreferences";

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
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { preferences, loading: preferencesLoading, savePreferences } = useListingPreferences();

  // Load saved preferences when component mounts
  useEffect(() => {
    if (!preferencesLoading && preferences) {
      setFormData(prev => ({
        ...prev,
        allowPickup: preferences.default_allow_pickup,
        allowMeetOnCampus: preferences.default_allow_meet_on_campus,
        allowDropOff: preferences.default_allow_drop_off,
        location: preferences.default_location || ""
      }));
    }
  }, [preferences, preferencesLoading]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const validatePhoneNumber = (text: string): boolean => {
    // Common phone number patterns
    const phonePatterns = [
      /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, // 123-456-7890, 123.456.7890, 123 456 7890
      /\b\(\d{3}\)\s?\d{3}[-.\s]?\d{4}\b/, // (123) 456-7890
      /\b\d{10}\b/, // 1234567890
      /\b\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/, // +1 123 456 7890
      /\b\d{3}[-.\s]?\d{4}\b/, // 123-4567 (7 digits)
    ];
    
    return phonePatterns.some(pattern => pattern.test(text));
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

    // Check for phone numbers in description
    if (validatePhoneNumber(formData.description)) {
      toast({
        title: "Phone Numbers Not Allowed",
        description: "Please remove phone numbers from the description. Use the messaging system to share contact details.",
        variant: "destructive",
      });
      return;
    }

    if (listingType === 'offer' && formData.images.length === 0) {
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
      // Fetch user's college_id for RLS compliance
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('college_id')
        .eq('id', user.id)
        .single();

      if (profileError || !profileData?.college_id) {
        throw new Error('Could not fetch user profile');
      }

      const insertData: any = {
        user_id: user.id,
        college_id: profileData.college_id,
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
      return category === 'services' ? 'Budget per hour' : category === 'housing' ? 'Budget per month' : 'Budget';
    }
    return category === 'services' ? 'Price per hour' : category === 'housing' ? 'Price per month' : 'Price';
  };

  return {
    formData,
    loading,
    saveAsDefault,
    setSaveAsDefault,
    handleInputChange,
    handleImagesChange,
    handleSubmit,
    getFormTitle,
    getPricePlaceholder
  };
};
