import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const adSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  ad_type: z.enum(['banner', 'sidebar', 'popup', 'featured']),
  image_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  video_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  link_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
});

type AdFormData = z.infer<typeof adSchema>;

interface BusinessAdUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
}

export const BusinessAdUpload: React.FC<BusinessAdUploadProps> = ({
  open,
  onOpenChange,
  businessId,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AdFormData>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: '',
      description: '',
      ad_type: 'banner',
      image_url: '',
      video_url: '',
      link_url: '',
      starts_at: '',
      ends_at: '',
    },
  });

  const uploadAdMutation = useMutation({
    mutationFn: async (data: AdFormData) => {
      const { error } = await supabase.from('business_ads').insert({
        business_id: businessId,
        title: data.title,
        description: data.description,
        ad_type: data.ad_type,
        image_url: data.image_url || null,
        video_url: data.video_url || null,
        link_url: data.link_url || null,
        starts_at: data.starts_at ? new Date(data.starts_at).toISOString() : new Date().toISOString(),
        ends_at: data.ends_at ? new Date(data.ends_at).toISOString() : null,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Your ad has been submitted for approval!',
      });
      form.reset();
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ['business-ads'] });
      queryClient.invalidateQueries({ queryKey: ['business-stats'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload ad',
        variant: 'destructive',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Promotional Ad</DialogTitle>
          <DialogDescription>
            Submit your promotional material for review. Admin will approve before it goes live.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => uploadAdMutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Special Offer for Duke Students" {...field} />
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
                      placeholder="Describe your promotional offer..."
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
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="featured">Featured</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose where your ad will be displayed
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
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/ad-image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Upload your image and provide the URL
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
                  <FormLabel>Link URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourbusiness.com/offer" {...field} />
                  </FormControl>
                  <FormDescription>
                    Where should the ad link to?
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3">
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
                disabled={uploadAdMutation.isPending}
                className="flex-1"
              >
                {uploadAdMutation.isPending ? 'Submitting...' : 'Submit Ad'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};