import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Sparkles, MapPin, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

import { CrossPostDialog } from "@/components/listings/CrossPostDialog";
import { useLocationService } from "@/hooks/useLocationService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ListingType = 'offer' | 'wanted';

export default function SmartCreateListing() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: 'marketplace' as 'marketplace' | 'housing' | 'services',
    listingType: 'offer' as ListingType,
    openToNegotiation: true,
    allowPickup: true,
    allowMeetOnCampus: true
  });
  
  const [showCrossPost, setShowCrossPost] = useState(false);
  const [createdListingId, setCreatedListingId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { requestLocation, getLocationSuggestions, loading: locationLoading } = useLocationService();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleAnalyzeImages = async () => {
    if (images.length < 1) {
      toast.error('Please upload at least 1 image');
      return;
    }

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-listing-image', {
        body: { imageUrls: images }
      });

      if (error) throw error;

      if (data) {
        setAiSuggestions(data);
        setFormData(prev => ({
          ...prev,
          title: data.title,
          description: data.description,
          category: data.category
        }));
        toast.success('AI analyzed your images! Review the suggestions.');
        setStep(2);
      }
    } catch (error) {
      console.error('Image analysis error:', error);
      toast.error('Failed to analyze images. You can still create the listing manually.');
      setStep(2);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleLocationRequest = async () => {
    const loc = await requestLocation();
    if (loc) {
      setFormData(prev => ({ ...prev, location: loc.name }));
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to create a listing');
      return;
    }

    if (!formData.title || !formData.description || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('college_id, profile_name')
        .eq('id', user.id)
        .single();

      if (!profile?.college_id) {
        toast.error('Could not verify your college association');
        return;
      }

      const { data: newListing, error } = await supabase
        .from('listings')
        .insert({
          user_id: user.id,
          college_id: profile.college_id,
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          location: formData.location,
          category: formData.category,
          listing_type: formData.listingType,
          images: images,
          open_to_negotiation: formData.openToNegotiation,
          allow_pickup: formData.allowPickup,
          allow_meet_on_campus: formData.allowMeetOnCampus,
          moderation_status: 'approved'
        })
        .select()
        .single();

      if (error) throw error;

      setCreatedListingId(newListing.id);
      toast.success('Listing created successfully!');
      setShowCrossPost(true);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const handleCrossPostClose = () => {
    setShowCrossPost(false);
    navigate('/my-listings');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Smart Listing Creation
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Upload Images */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload 4-5 clear photos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our AI will analyze your images to suggest a title and description
                </p>
                <ImageUpload
                  images={images}
                  onImagesChange={setImages}
                  maxImages={5}
                />
              </div>

              <Button
                onClick={handleAnalyzeImages}
                disabled={images.length < 1 || analyzing}
                className="w-full"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Images...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze with AI
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 2: Review/Edit AI Suggestions */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What are you selling?"
                />
                {aiSuggestions && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ✨ AI suggested based on your images
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe your item"
                />
              </div>

              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1" disabled={!formData.price}>
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Where is the item?"
                    list="location-suggestions"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLocationRequest}
                    disabled={locationLoading}
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
                <datalist id="location-suggestions">
                  {getLocationSuggestions(formData.location).map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setStep(4)} className="flex-1">
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Final Options */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Listing Type</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={formData.listingType === 'offer' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, listingType: 'offer' }))}
                    className="flex-1"
                  >
                    I'm Selling
                  </Button>
                  <Button
                    type="button"
                    variant={formData.listingType === 'wanted' ? 'default' : 'outline'}
                    onClick={() => setFormData(prev => ({ ...prev, listingType: 'wanted' }))}
                    className="flex-1"
                  >
                    I'm Buying
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="openToNegotiation"
                    checked={formData.openToNegotiation}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, openToNegotiation: checked as boolean }))
                    }
                  />
                  <Label htmlFor="openToNegotiation">Open to negotiation</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowPickup"
                    checked={formData.allowPickup}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, allowPickup: checked as boolean }))
                    }
                  />
                  <Label htmlFor="allowPickup">Allow pickup</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allowMeetOnCampus"
                    checked={formData.allowMeetOnCampus}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, allowMeetOnCampus: checked as boolean }))
                    }
                  />
                  <Label htmlFor="allowMeetOnCampus">Meet on campus</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Listing'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {user && (
        <CrossPostDialog
          open={showCrossPost}
          onOpenChange={handleCrossPostClose}
          listingUrl={`${window.location.origin}/marketplace/${createdListingId}`}
          listingTitle={formData.title}
          listingPrice={formData.price}
          userName={user.email?.split('@')[0] || 'User'}
        />
      )}
    </div>
  );
}
