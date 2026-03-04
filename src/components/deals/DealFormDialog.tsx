import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { dealSchema, DealSchemaType } from '@/validations/dealSchemas';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Deal } from '@/types/deals';

interface DealFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  deal?: Deal | null; // If provided, edit mode
}

export const DealFormDialog: React.FC<DealFormDialogProps> = ({
  open, onOpenChange, onSuccess, deal,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditing = !!deal;

  const form = useForm<DealSchemaType>({
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '', description: '', business_name: '',
      discount_percentage: undefined, original_price: undefined,
      discounted_price: undefined, business_website: '', business_phone: '',
      business_email: '', image_url: '', terms_and_conditions: '',
      valid_from: '', valid_until: '',
    },
  });

  useEffect(() => {
    if (deal) {
      form.reset({
        title: deal.title,
        description: deal.description,
        business_name: deal.business_name,
        discount_percentage: deal.discount_percentage ?? undefined,
        original_price: deal.original_price ?? undefined,
        discounted_price: deal.discounted_price ?? undefined,
        business_website: deal.business_website || '',
        business_phone: deal.business_phone || '',
        business_email: deal.business_email || '',
        image_url: deal.image_url || '',
        terms_and_conditions: deal.terms_and_conditions || '',
        valid_until: deal.valid_until ? new Date(deal.valid_until).toISOString().split('T')[0] : '',
      });
    } else {
      form.reset();
    }
  }, [deal, form]);

  const mutation = useMutation({
    mutationFn: async (data: DealSchemaType) => {
      const dealData = {
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
      };

      if (isEditing) {
        const { error } = await supabase.from('deals')
          .update({ ...dealData, is_active: deal.is_active })
          .eq('id', deal.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('deals')
          .insert([{ ...dealData, created_by: user!.id, is_active: false }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: isEditing ? 'Deal updated!' : 'Deal submitted for approval!',
      });
      form.reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${isEditing ? 'update' : 'create'} deal`,
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Deal Title *</FormLabel>
                  <FormControl><Input placeholder="Amazing discount on..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="business_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name *</FormLabel>
                  <FormControl><Input placeholder="Business name" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="discount_percentage" render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount %</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="25" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="original_price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Original Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="100.00" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="discounted_price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Price</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="75.00" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="valid_until" render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Until</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl><Textarea placeholder="Describe the deal..." className="resize-none" rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="image_url" render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="business_website" render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl><Input placeholder="business.com" {...field} /></FormControl>
                  <FormDescription className="text-xs">With or without https://</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="business_phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="business_email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="contact@business.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="terms_and_conditions" render={({ field }) => (
              <FormItem>
                <FormLabel>Terms & Conditions</FormLabel>
                <FormControl><Textarea placeholder="Terms and conditions..." className="resize-none" rows={3} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Deal' : 'Create Deal')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
