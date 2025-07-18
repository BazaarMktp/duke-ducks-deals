import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  ExternalLink, 
  Phone, 
  Mail, 
  Globe,
  Store,
  Percent
} from 'lucide-react';

export default function DealDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: deal, isLoading } = useQuery({
    queryKey: ['deal', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading deal details...</div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Deal not found</h2>
          <Button onClick={() => navigate('/devils-deals')}>
            Back to Devil's Deals
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-16">
            <div className="rounded-full bg-muted p-6 mx-auto mb-6 w-fit">
              <Percent className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              You need to log in to view the full details of this deal.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/auth')}>
                Login
              </Button>
              <Button variant="outline" onClick={() => navigate('/devils-deals')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Deals
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isExpiringSoon = () => {
    if (!deal.valid_until) return false;
    const validUntil = new Date(deal.valid_until);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return validUntil <= threeDaysFromNow;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/devils-deals')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Devil's Deals
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              {deal.image_url && (
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted mb-6">
                  <img
                    src={deal.image_url}
                    alt={deal.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{deal.title}</h1>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{deal.business_name}</span>
                    </div>
                  </div>
                </div>
                
                {deal.discount_percentage && (
                  <Badge variant="destructive" className="text-lg px-3 py-1">
                    {deal.discount_percentage}% OFF
                  </Badge>
                )}
              </div>

              {(deal.original_price || deal.discounted_price) && (
                <div className="flex items-center gap-3 mb-4">
                  {deal.original_price && deal.discounted_price && (
                    <>
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(deal.discounted_price)}
                      </span>
                      <span className="text-xl text-muted-foreground line-through">
                        {formatPrice(deal.original_price)}
                      </span>
                      <Badge variant="secondary">
                        Save {formatPrice(deal.original_price - deal.discounted_price)}
                      </Badge>
                    </>
                  )}
                  {deal.discounted_price && !deal.original_price && (
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(deal.discounted_price)}
                    </span>
                  )}
                </div>
              )}

              {deal.valid_until && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Valid until {formatDate(deal.valid_until)}</span>
                  {isExpiringSoon() && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Expires Soon
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {deal.description}
                  </p>
                </div>

                {deal.terms_and_conditions && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Terms & Conditions</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {deal.terms_and_conditions}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {deal.business_website && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(deal.business_website, '_blank')}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Visit Website
                    <ExternalLink className="w-4 h-4 ml-auto" />
                  </Button>
                )}

                {deal.business_phone && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(`tel:${deal.business_phone}`, '_self')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    {deal.business_phone}
                  </Button>
                )}

                {deal.business_email && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.open(`mailto:${deal.business_email}`, '_self')}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {deal.business_email}
                  </Button>
                )}
              </div>

              <Separator />

              <div className="text-xs text-muted-foreground">
                Deal posted on {formatDate(deal.created_at)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}