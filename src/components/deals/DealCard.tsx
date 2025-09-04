import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Edit, Trash2 } from 'lucide-react';
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
  is_active: boolean;
}

interface DealCardProps {
  deal: Deal;
  isAuthenticated: boolean;
  isAdmin?: boolean;
  onEdit?: (deal: Deal) => void;
  onDelete?: (dealId: string) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ 
  deal, 
  isAuthenticated, 
  isAdmin = false,
  onEdit,
  onDelete 
}) => {
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

  const getDealStatus = () => {
    if (!deal.valid_until) return null;
    const validUntil = new Date(deal.valid_until);
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(now.getDate() + 3);
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);
    
    if (validUntil <= threeDaysFromNow) {
      return { type: 'expires-soon', label: 'Expires Soon', variant: 'outline' as const, className: 'text-orange-600 border-orange-200' };
    } else if (validUntil <= oneMonthFromNow) {
      return { type: 'hot', label: 'Hot Deal', variant: 'destructive' as const, className: 'bg-red-500 text-white' };
    } else {
      return { type: 'extended', label: 'Extended Deal', variant: 'secondary' as const, className: 'bg-blue-500 text-white' };
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20">
      <CardHeader className="pb-4">
        {deal.image_url && (
          <div 
            className="aspect-video w-full overflow-hidden rounded-lg bg-muted cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => navigate(`/devils-deals/${deal.id}`)}
          >
            <img
              src={deal.image_url}
              alt={deal.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {deal.title}
            </h3>
            <div className="flex gap-1 shrink-0">
              {deal.discount_percentage && (
                <Badge variant="destructive">
                  {deal.discount_percentage}% OFF
                </Badge>
              )}
              {(() => {
                const status = getDealStatus();
                return status ? (
                  <Badge variant={status.variant} className={status.className}>
                    {status.label}
                  </Badge>
                ) : null;
              })()}
            </div>
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
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button
            onClick={() => navigate(`/devils-deals/${deal.id}`)}
            className="flex-1"
            variant={isAuthenticated ? "default" : "outline"}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isAuthenticated ? "View Details" : "Login to View Details"}
          </Button>
          
          {isAdmin && onEdit && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(deal);
              }}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          
          {isAdmin && onDelete && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(deal.id);
              }}
              variant="outline"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};