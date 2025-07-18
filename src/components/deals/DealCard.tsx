import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount_percentage?: number;
  original_price?: number;
  discounted_price?: number;
  business_name: string;
  image_url?: string;
  valid_until?: string;
  created_at: string;
}

interface DealCardProps {
  deal: Deal;
  isAuthenticated: boolean;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, isAuthenticated }) => {
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
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
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20">
      <CardHeader className="pb-4">
        {deal.image_url && (
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <img
              src={deal.image_url}
              alt={deal.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {deal.title}
            </h3>
            {deal.discount_percentage && (
              <Badge variant="destructive" className="ml-2 shrink-0">
                {deal.discount_percentage}% OFF
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground font-medium">
            {deal.business_name}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {deal.description}
        </p>

        {(deal.original_price || deal.discounted_price) && (
          <div className="flex items-center gap-2 mb-4">
            {deal.original_price && deal.discounted_price && (
              <>
                <span className="text-lg font-bold text-primary">
                  {formatPrice(deal.discounted_price)}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(deal.original_price)}
                </span>
              </>
            )}
            {deal.discounted_price && !deal.original_price && (
              <span className="text-lg font-bold text-primary">
                {formatPrice(deal.discounted_price)}
              </span>
            )}
          </div>
        )}

        {deal.valid_until && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Valid until {formatDate(deal.valid_until)}</span>
            {isExpiringSoon() && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                Expires Soon
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={() => navigate(`/devils-deals/${deal.id}`)}
          className="w-full"
          variant={isAuthenticated ? "default" : "outline"}
        >
          <Eye className="w-4 h-4 mr-2" />
          {isAuthenticated ? "View Details" : "Login to View Details"}
        </Button>
      </CardFooter>
    </Card>
  );
};