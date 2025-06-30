import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ImageUpload";
import type { ListingFormData } from '@/hooks/useCreateListing';
import type { NavigateFunction } from 'react-router-dom';

interface CreateListingFormProps {
  formData: ListingFormData;
  loading: boolean;
  handleInputChange: (field: string, value: string | boolean) => void;
  handleImagesChange: (images: string[]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  navigate: NavigateFunction;
}

const CreateListingForm: React.FC<CreateListingFormProps> = ({
  formData,
  loading,
  handleInputChange,
  handleImagesChange,
  handleSubmit,
  navigate,
}) => {
  const getTitlePlaceholder = () => {
    if (formData.listingType === 'wanted') {
      switch (formData.category) {
        case 'marketplace':
          return 'Looking for desk lamp with adjustable brightness';
        case 'housing':
          return 'Looking for 2-bedroom apartment near campus';
        case 'services':
          return 'Need math tutoring for calculus';
        default:
          return 'What are you looking for?';
      }
    } else {
      switch (formData.category) {
        case 'marketplace':
          return 'Desk Lamp - LED with Adjustable Brightness';
        case 'housing':
          return '2-Bedroom Apartment Available for Spring Semester';
        case 'services':
          return 'Math Tutoring - Calculus & Statistics';
        default:
          return 'Enter title here...';
      }
    }
  };

  const getDescriptionPlaceholder = () => {
    if (formData.listingType === 'wanted') {
      switch (formData.category) {
        case 'marketplace':
          return 'I\'m looking for a desk lamp with adjustable brightness for studying. Preferably LED with different color temperatures (warm/cool white). Should be sturdy and not too bulky for my dorm desk. Willing to meet on campus or arrange pickup.';
        case 'housing':
          return 'Looking for a 2-bedroom apartment or house within walking distance of campus. Need it for the spring semester (January-May). Prefer furnished or partially furnished. Must allow pets (small dog). Budget is flexible for the right place.';
        case 'services':
          return 'I need help with Calculus I - specifically with derivatives and integration. Looking for someone who can meet twice a week, preferably in the evenings. Can meet at the library or virtually. Please mention your experience and availability.';
        default:
          return 'Please provide detailed information about what you\'re looking for, including specifications, preferred condition, timeline, and any other requirements...';
      }
    } else {
      switch (formData.category) {
        case 'marketplace':
          return 'LED desk lamp with adjustable brightness and color temperature. Perfect for studying with 3 brightness levels and warm/cool white options. Sturdy metal base with flexible arm. Used for 1 semester, excellent condition. Great for dorm or study spaces.';
        case 'housing':
          return 'Beautiful 2-bedroom apartment available for spring semester sublease. Fully furnished with modern appliances. 10-minute walk to campus. Includes utilities (water, electricity, internet). Pet-friendly building with laundry facilities. Available January 1st.';
        case 'services':
          return 'Experienced math tutor offering help with Calculus, Statistics, and Algebra. I\'m a senior math major with 3+ years of tutoring experience. Available weekday evenings and weekends. Can meet at the library, your place, or conduct sessions online.';
        default:
          return 'Describe your listing in detail. Include condition, features, availability, and any important information buyers should know...';
      }
    }
  };

  const getLocationPlaceholder = () => {
    if (formData.listingType === 'wanted') {
      return 'Campus library, dorms, or anywhere on campus';
    }
    return 'North Campus, Student Union, Main Library area';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketplace">Marketplace</SelectItem>
              {/* Temporarily disabled - can be re-enabled later */}
              {/* <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="services">Services</SelectItem> */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="listingType">Type of Listing</Label>
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
        <Label htmlFor="title" className="text-base font-medium">
          {formData.listingType === 'wanted' ? 'What are you looking for?' : 'Title'} *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          required
          placeholder={getTitlePlaceholder()}
          className={formData.listingType === 'wanted' ? "text-lg py-3" : ""}
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-medium">
          {formData.listingType === 'wanted' ? 'Detailed description of your needs' : 'Description'} *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          required
          rows={formData.listingType === 'wanted' ? 6 : 4}
          placeholder={getDescriptionPlaceholder()}
          className={formData.listingType === 'wanted' ? "text-base leading-relaxed" : ""}
        />
        {formData.listingType === 'wanted' && (
          <p className="text-sm text-muted-foreground mt-2">
            💡 The more details you provide, the better responses you'll get from potential sellers!
          </p>
        )}
      </div>

      {/* Images are required for both offers and requests now */}
      <div>
        <Label className="text-base font-medium">Images *</Label>
        <ImageUpload
          images={formData.images}
          onImagesChange={handleImagesChange}
          maxImages={5}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-base font-medium">
            {formData.listingType === 'wanted' ? 'Budget' : 'Price'} {formData.category === 'services' ? '(per hour)' : formData.category === 'housing' ? '(per month)' : ''} *
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange("price", e.target.value)}
            required
            placeholder={formData.category === 'services' ? '25.00' : formData.category === 'housing' ? '800.00' : '299.99'}
            className={formData.listingType === 'wanted' ? "text-lg" : ""}
          />
        </div>

        <div>
          <Label htmlFor="location" className="text-base font-medium">My Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder={getLocationPlaceholder()}
            className={formData.listingType === 'wanted' ? "text-lg" : ""}
          />
        </div>
      </div>

      {/* Transaction Methods */}
      {formData.category === 'marketplace' && formData.listingType === 'offer' && (
        <div className="space-y-3">
          <Label className="text-base font-medium">Transaction Methods</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowPickup"
                checked={formData.allowPickup}
                onCheckedChange={(checked) => handleInputChange("allowPickup", checked as boolean)}
              />
              <Label htmlFor="allowPickup" className="text-sm font-normal">
                Allow pickup
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allowMeetOnCampus"
                checked={formData.allowMeetOnCampus}
                onCheckedChange={(checked) => handleInputChange("allowMeetOnCampus", checked as boolean)}
              />
              <Label htmlFor="allowMeetOnCampus" className="text-sm font-normal">
                Meet on campus
              </Label>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Select at least one transaction method for your listing
          </p>
        </div>
      )}

      {/* Additional help text for requests */}
      {formData.listingType === 'wanted' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Tips for better responses:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about what you're looking for</li>
            <li>• Include your preferred condition (new, used, etc.)</li>
            <li>• Mention your timeline or urgency</li>
            <li>• Add any size, color, or model preferences</li>
          </ul>
        </div>
      )}

      {/* Temporarily disabled - can be re-enabled later */}
      {/* {formData.category === 'housing' && (
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
      )} */}

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
          {loading ? "Creating..." : `Create ${formData.listingType === 'wanted' ? 'Request' : 'Listing'}`}
        </Button>
      </div>
    </form>
  );
};

export default CreateListingForm;
