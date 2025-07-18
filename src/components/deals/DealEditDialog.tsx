import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  business_name: z.string().min(1, 'Business name is required'),
  discount_percentage: z.number().min(0).max(100).optional(),
  original_price: z.number().min(0).optional(),
  discounted_price: z.number().min(0).optional(),
  business_website: z.string().url().optional().or(z.literal('')),
  business_phone: z.string().optional(),
  business_email: z.string().email().optional().or(z.literal('')),
  image_url: z.string().url().optional().or(z.literal('')),
  terms_and_conditions: z.string().optional(),
  valid_until: z.string().optional(),
  is_active: z.boolean(),
});

type DealFormData = z.infer<typeof dealSchema>;

interface Deal {
  id: string;
  title: string;
  description: string;
  business_name: string;
  discount_percentage?: number;
  original_price?: number;
  discounted_price?: number;
  business_website?: string;
  business_phone?: string;
  business_email?: string;
  image_url?: string;
  terms_and_conditions?: string;
  valid_until?: string;
  is_active: boolean;
}

interface DealEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  deal: Deal | null;
}

export const DealEditDialog: React.FC<DealEditDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  deal,
}) => {
  const { toast } = useToast();

  const form = useForm<DealFormData>({
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
      is_active: true,
    },
  });

  // Populate form when deal changes
  useEffect(() => {
    if (deal) {
      const validUntil = deal.valid_until ? new Date(deal.valid_until).toISOString().split('T')[0] : '';
      
      form.reset({
        title: deal.title,
        description: deal.description,
        business_name: deal.business_name,
        discount_percentage: deal.discount_percentage || 0,
        original_price: deal.original_price || 0,
        discounted_price: deal.discounted_price || 0,
        business_website: deal.business_website || '',
        business_phone: deal.business_phone || '',
        business_email: deal.business_email || '',
        image_url: deal.image_url || '',
        terms_and_conditions: deal.terms_and_conditions || '',
        valid_until: validUntil,
        is_active: deal.is_active,
      });
    }
  }, [deal, form]);

  const updateDealMutation = useMutation({
    mutationFn: async (data: DealFormData) => {
      if (!deal) throw new Error('No deal to update');
      
      console.log('Updating deal with data:', data);
      
      const dealData: any = {
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
        valid_until: data.valid_until ? new Date(data.valid_until).toISOString() : null,
        is_active: data.is_active,
        updated_at: new Date().toISOString(),
      };

      console.log('Prepared deal update data:', dealData);

      const { data: result, error } = await supabase
        .from('deals')
        .update(dealData)
        .eq('id', deal.id)
        .select();
      
      if (error) {
        console.error('Deal update error:', error);
        throw error;
      }
      console.log('Deal updated successfully:', result);
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Deal updated successfully!',
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Deal update mutation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update deal',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: DealFormData) => {
    updateDealMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Deal Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Amazing discount on..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount %</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="25"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
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
                    <FormLabel>Original Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
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
                    <FormLabel>Sale Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="75.00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Until</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the deal..."
                      className="resize-none"
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
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="business_website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://business.com" {...field} />
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
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="business_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@business.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="terms_and_conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms & Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Terms and conditions for this deal..."
                      className="resize-none"
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
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="rounded border-gray-300"
                    />
                  </FormControl>
                  <FormLabel>Active Deal</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateDealMutation.isPending}>
                {updateDealMutation.isPending ? 'Updating...' : 'Update Deal'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};