import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Building2, CheckCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const businessSchema = z.object({
  business_name: z.string().min(2, 'Business name must be at least 2 characters'),
  business_description: z.string().optional(),
  business_website: z.string().url().optional().or(z.literal('')),
  business_email: z.string().email().optional().or(z.literal('')),
  business_phone: z.string().optional(),
  business_address: z.string().optional(),
  business_logo_url: z.string().url().optional().or(z.literal('')),
});

type BusinessFormData = z.infer<typeof businessSchema>;

export default function BusinessOnboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      business_name: '',
      business_description: '',
      business_website: '',
      business_email: '',
      business_phone: '',
      business_address: '',
      business_logo_url: '',
    },
  });

  // Check if business profile already exists
  const { data: existingProfile, isLoading } = useQuery({
    queryKey: ['business-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user,
  });

  const createProfileMutation = useMutation({
    mutationFn: async (formData: BusinessFormData) => {
      // First create the business profile
      const { data: profile, error: profileError } = await supabase
        .from('business_profiles')
        .insert([{
          user_id: user!.id,
          business_name: formData.business_name,
          business_description: formData.business_description,
          business_website: formData.business_website,
          business_email: formData.business_email,
          business_phone: formData.business_phone,
          business_address: formData.business_address,
          business_logo_url: formData.business_logo_url,
        }])
        .select()
        .single();

      if (profileError) throw profileError;

      // Then assign the business role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user!.id,
          role: 'business',
        });

      if (roleError && roleError.code !== '23505') throw roleError; // Ignore unique constraint errors

      return profile;
    },
    onSuccess: () => {
      setIsComplete(true);
      toast({
        title: 'Success!',
        description: 'Your business profile has been created. Admin will review your application.',
      });
      setTimeout(() => navigate('/business-dashboard'), 3000);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create business profile',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (existingProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              Business Profile Exists
            </CardTitle>
            <CardDescription>
              Your business profile is {existingProfile.verification_status}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/business-dashboard')}>
              Go to Business Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Application Submitted!
            </CardTitle>
            <CardDescription>
              Your business profile has been created and is pending admin approval.
              You'll be redirected to your dashboard shortly.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Business Onboarding – Devil's Deals | Bazaar</title>
        <meta name="description" content="Register your business to promote deals and offers to Duke students on Devil's Deals." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Join Devil's Deals</h1>
            <p className="text-muted-foreground text-lg">
              Promote your business to Duke students with exclusive deals and ads
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Fill out your business details to get started. Admin will review and approve your profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createProfileMutation.mutate(data))} className="space-y-6">
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

                  <FormField
                    control={form.control}
                    name="business_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell students about your business..."
                            rows={4}
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
                          <FormLabel>Business Email</FormLabel>
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
                            <Input placeholder="(555) 123-4567" {...field} />
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
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourbusiness.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="business_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="123 Main St, Durham, NC 27701"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="business_logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/logo.png" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createProfileMutation.isPending}
                      className="flex-1"
                    >
                      {createProfileMutation.isPending ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}