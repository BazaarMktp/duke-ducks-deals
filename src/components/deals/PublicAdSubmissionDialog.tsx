import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { dealSchema } from '@/validations/dealSchemas';
import { z } from 'zod';
import { AdImageUpload } from '@/components/business/AdImageUpload';
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

  const form = useForm<z.infer<typeof dealSchema>>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      description: '',
      business_name: '',
      discount_percentage: 0,
      original_price: 0,
      discounted_price: 0,
      business_website: '',
      business_phone: '',
      business_email: '',
      image_url: '',
      terms_and_conditions: '',
      valid_until: '',
    },
  });

  const submitAdMutation = useMutation({
    mutationFn: async (data: z.infer<typeof dealSchema>) => {
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
        // Create new business profile without returning the row to avoid SELECT RLS on returning
        const generatedId = (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
          ? crypto.randomUUID()
          : `biz_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

        const { error: businessError } = await supabase
          .from('business_profiles')
          .insert({
            id: generatedId,
            user_id: null, // Allow null for public submissions
            business_name: data.business_name,
            business_email: data.business_email || '',
            business_phone: data.business_phone,
            business_website: data.business_website,
            verification_status: 'pending',
          });

        if (businessError) throw businessError;
        businessId = generatedId;
      }

      // Create the deal in the deals table (same as admin)
      const { error: dealError } = await supabase.from('deals').insert({
        title: data.title,
        description: data.description,
        business_name: data.business_name,
        discount_percentage: data.discount_percentage || null,
        original_price: data.original_price || null,
        discounted_price: data.discounted_price || null,
        business_website: data.business_website || null,
        business_phone: data.business_phone || null,
        business_email: data.business_email || null,
        image_url: data.image_url || null,
        terms_and_conditions: data.terms_and_conditions || null,
        created_by: businessId, // Use business_id as created_by since no user auth
        valid_until: data.valid_until ? new Date(data.valid_until).toISOString() : null,
        is_active: false, // Requires approval
      });

      if (dealError) throw dealError;
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Submit Your Deal to Devil's Deals</DialogTitle>
          <DialogDescription className="text-base">
            Promote your business to Duke students. All deals are reviewed by our team before going live.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900">
            <strong>Professional Review Process:</strong> Our team will review your submission within 24-48 hours. You'll receive email confirmation once approved.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => submitAdMutation.mutate(data))} className="space-y-8">
            {/* Business Information Section */}
            <div className="space-y-4 p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h3 className="text-xl font-semibold">Business Information</h3>
              </div>
              
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Business Name *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your Business Name" 
                        className="h-11 text-base"
                        {...field} 
                      />
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
                      <FormLabel className="text-base">Business Email *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="contact@yourbusiness.com" 
                          className="h-11 text-base"
                          {...field} 
                        />
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
                      <FormLabel className="text-base">Business Phone</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+1 (555) 123-4567" 
                          className="h-11 text-base"
                          {...field} 
                        />
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
                    <FormLabel className="text-base">Business Website</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="yourbusiness.com" 
                        className="h-11 text-base"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Enter with or without https://
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Deal Details Section */}
            <div className="space-y-4 p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h3 className="text-xl font-semibold">Deal Details</h3>
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Deal Title *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="20% Off for Duke Students!" 
                        className="h-11 text-base"
                        {...field} 
                      />
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
                    <FormLabel className="text-base">Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your offer in detail..."
                        className="resize-none min-h-[100px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <FormField
                  control={form.control}
                  name="discount_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Discount %</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="25"
                          className="h-11 text-base"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="original_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Original Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="100.00"
                          className="h-11 text-base"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discounted_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Sale Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="75.00"
                          className="h-11 text-base"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Deal Image</FormLabel>
                    <FormControl>
                      <AdImageUpload
                        imageUrl={field.value || ''}
                        onImageChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Upload an eye-catching image or provide an image URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Valid Until (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="h-11 text-base"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Leave empty for ongoing deals
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms_and_conditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Terms & Conditions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any restrictions or conditions for this deal..."
                        className="resize-none min-h-[80px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-11 text-base"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitAdMutation.isPending}
                className="flex-1 h-11 text-base"
              >
                {submitAdMutation.isPending ? 'Submitting Deal...' : 'Submit Deal for Review'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};