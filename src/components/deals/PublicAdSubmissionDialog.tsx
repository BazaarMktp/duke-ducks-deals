import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessAdSchema } from '@/validations/dealSchemas';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface PublicAdSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PublicAdSubmissionDialog: React.FC<PublicAdSubmissionDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(businessAdSchema),
    defaultValues: {
      business_name: '',
      business_email: '',
      business_phone: '',
      business_website: '',
      title: '',
      description: '',
      ad_type: 'banner' as const,
      image_url: '',
      link_url: '',
      starts_at: '',
      ends_at: '',
    },
  });

  const submitAdMutation = useMutation({
    mutationFn: async (data: any) => {
      // First, create or get business profile
      const { data: existingBusiness, error: checkError } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('business_email', data.business_email)
        .maybeSingle();

      let businessId: string;

      if (existingBusiness) {
        businessId = existingBusiness.id;
      } else {
        // Create new business profile
        const { data: newBusiness, error: businessError } = await supabase
          .from('business_profiles')
          .insert({
            user_id: null, // Allow null for public submissions
            business_name: data.business_name,
            business_email: data.business_email,
            business_phone: data.business_phone,
            business_website: data.business_website,
            verification_status: 'pending',
          })
          .select('id')
          .single();

        if (businessError) throw businessError;
        businessId = newBusiness.id;
      }

      // Now create the ad
      const { error: adError } = await supabase.from('business_ads').insert({
        business_id: businessId,
        title: data.title,
        description: data.description,
        ad_type: data.ad_type,
        image_url: data.image_url || null,
        link_url: data.link_url || null,
        starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : new Date().toISOString(),
        ends_at: data.ends_at ? new Date(data.ends_at).toISOString() : null,
        approval_status: 'pending',
        is_active: false,
      });

      if (adError) throw adError;
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Your ad has been submitted for approval. Bazaar admin will review it shortly.',
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit ad. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Promote Your Business on Devil's Deals</DialogTitle>
          <DialogDescription>
            Submit your promotional ad for review. Bazaar admin will approve it before it goes live.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            All ads require admin approval before being displayed. You'll be notified via email once approved.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => submitAdMutation.mutate(data))} className="space-y-6">
            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Information</h3>
              
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="business_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@business.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="business_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="business_website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourbusiness.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Ad Information */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Advertisement Details</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="20% Off for Duke Students!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your offer in detail..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ad_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ad type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="banner">Banner - Horizontal display at top</SelectItem>
                        <SelectItem value="sidebar">Sidebar - Vertical side display</SelectItem>
                        <SelectItem value="featured">Featured - Premium placement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose where your ad will appear on the page
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-ad-image.jpg" {...field} />
                    </FormControl>
                    <FormDescription>
                      Upload your image to a hosting service and provide the URL (recommended: 1200x400px for banner)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="link_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourbusiness.com/special-offer" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where should users go when they click your ad?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="starts_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>When should your ad start running?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ends_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date (Optional)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Leave empty for ongoing promotion</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitAdMutation.isPending}
                className="flex-1"
              >
                {submitAdMutation.isPending ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};