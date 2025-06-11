
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "./ImageUpload";

interface PostingFormProps {
  category: 'marketplace' | 'housing' | 'services';
  onClose: () => void;
  onSuccess: () => void;
  listingType?: 'offer' | 'wanted';
}

const PostingForm: React.FC<PostingFormProps> = ({ 
  category, 
  onClose, 
  onSuccess, 
  listingType = 'offer' 
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    housingType: "",
    images: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{getFormTitle()}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">
                {listingType === 'wanted' ? 'What are you looking for?' : 'Title'}
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                placeholder={
                  listingType === 'wanted' 
                    ? `What ${category} are you looking for?`
                    : `Enter ${category} title...`
                }
              />
            </div>

            <div>
              <Label htmlFor="description">
                {listingType === 'wanted' ? 'Additional details' : 'Description'}
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
                placeholder={
                  listingType === 'wanted' 
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
                  {getPricePlaceholder()} {listingType === 'wanted' && '(Optional)'}
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

            {category === 'housing' && (
              <div>
                <Label htmlFor="housingType">Housing Type</Label>
                <Select onValueChange={(value) => handleInputChange("housingType", value)}>
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
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Posting..." : `Post ${listingType === 'wanted' ? 'Request' : 'Listing'}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostingForm;
