
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";
import { Loader2 } from "lucide-react";

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "marketplace" as 'marketplace' | 'housing' | 'services',
    listingType: "offer" as 'offer' | 'wanted',
    housingType: "",
    images: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (id && user) {
      fetchListing();
    }
  }, [id, user]);

  const fetchListing = async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price ? data.price.toString() : "",
          location: data.location || "",
          category: data.category || "marketplace",
          listingType: data.listing_type || "offer",
          housingType: data.housing_type || "",
          images: data.images || []
        });
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error("Failed to load listing.");
      navigate('/my-listings');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    setLoading(true);
    try {
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        category: formData.category,
        listing_type: formData.listingType,
        location: formData.location || null,
        images: formData.images.length > 0 ? formData.images : null,
        updated_at: new Date().toISOString()
      };

      if (formData.category === 'housing' && formData.housingType) {
        updateData.housing_type = formData.housingType;
      }

      const { error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Listing updated successfully!");
      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error("Failed to update listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            Edit {formData.listingType === 'wanted' ? 'Request' : 'Listing'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="listingType">Type</Label>
                <Select value={formData.listingType} onValueChange={(value) => handleInputChange("listingType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offer">Offering</SelectItem>
                    <SelectItem value="wanted">Looking For</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">
                {formData.listingType === 'wanted' ? 'What are you looking for?' : 'Title'}
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                placeholder={
                  formData.listingType === 'wanted' 
                    ? `What ${formData.category} are you looking for?`
                    : `Enter ${formData.category} title...`
                }
              />
            </div>

            <div>
              <Label htmlFor="description">
                {formData.listingType === 'wanted' ? 'Additional details' : 'Description'}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                placeholder={
                  formData.listingType === 'wanted' 
                    ? "Provide more details about what you're looking for..."
                    : "Describe your listing..."
                }
              />
            </div>

            <ImageUpload
              images={formData.images}
              onImagesChange={handleImagesChange}
              maxImages={5}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">
                  {formData.listingType === 'wanted' ? 'Budget' : 'Price'} {formData.category === 'services' ? '(per hour)' : formData.category === 'housing' ? '(per month)' : ''}
                  {formData.listingType === 'wanted' && ' (Optional)'}
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter location..."
                />
              </div>
            </div>

            {formData.category === 'housing' && (
              <div>
                <Label htmlFor="housingType">Housing Type</Label>
                <Select value={formData.housingType} onValueChange={(value) => handleInputChange("housingType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select housing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sublease">Sublease</SelectItem>
                    <SelectItem value="for_rent">For Rent</SelectItem>
                    <SelectItem value="roommate_wanted">Roommate Wanted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/my-listings')} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Updating..." : `Update ${formData.listingType === 'wanted' ? 'Request' : 'Listing'}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditListing;
