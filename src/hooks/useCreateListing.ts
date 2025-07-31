
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useAIAnalysis } from "./useAIAnalysis";


export type ListingFormData = {
  title: string;
  description: string;
  price: string;
  location: string;
  category: 'marketplace' | 'housing' | 'services';
  listingType: 'offer' | 'wanted';
  housingType: string;
  images: string[];
  allowPickup: boolean;
  allowMeetOnCampus: boolean;
  allowDropOff: boolean;
  openToNegotiation: boolean;
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
    allowPickup: false,
    allowMeetOnCampus: false,
    allowDropOff: false,
    openToNegotiation: false,
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { moderateContent, trackAIInteraction } = useAIAnalysis();

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
      toast.error("Title is required.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Description is required.");
      return;
    }

    if (formData.listingType === 'offer' && formData.images.length === 0) {
      toast.error("At least one image is required for listings.");
      return;
    }

    if (!formData.price) {
      toast.error("Price is required.");
      return;
    }

    // Validation for marketplace items
    if (formData.category === 'marketplace' && formData.listingType === 'offer' && !formData.allowPickup && !formData.allowMeetOnCampus && !formData.allowDropOff) {
      toast.error("Please select at least one transaction method.");
      return;
    }

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

      // Moderate content with AI
      const moderationResult = await moderateContent(formData.title, formData.description);
      const moderationStatus = moderationResult.flagged ? 'flagged' : 'approved';

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
        moderation_status: moderationStatus,
        moderation_flags: moderationResult.flags || [],
        open_to_negotiation: formData.openToNegotiation,
      };

      // Add transaction methods for marketplace items
      if (formData.category === 'marketplace') {
        insertData.allow_pickup = formData.allowPickup;
        insertData.allow_meet_on_campus = formData.allowMeetOnCampus;
        insertData.allow_drop_off = formData.allowDropOff;
      }

      if (formData.category === 'housing' && formData.housingType) {
        insertData.housing_type = formData.housingType;
      }

      const { data: newListing, error } = await supabase
        .from('listings')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Track content moderation interaction
      await trackAIInteraction(
        newListing.id,
        'content_moderated',
        moderationResult,
        moderationStatus === 'approved' ? 'auto_approved' : 'flagged_for_review'
      );

      // AI analysis will be triggered automatically by the database after listing creation

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
