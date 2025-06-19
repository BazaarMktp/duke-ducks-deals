import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import type { ListingFormData } from '@/hooks/useCreateListing';
import type { NavigateFunction } from 'react-router-dom';

interface CreateListingFormProps {
  formData: ListingFormData;
  loading: boolean;
  handleInputChange: (field: string, value: string) => void;
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
  return (
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
              {/* Temporarily disabled - can be re-enabled later */}
              {/* <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="services">Services</SelectItem> */}
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
