import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign } from 'lucide-react';

export const BusinessDealsList: React.FC = () => {
  const { user } = useAuth();

  const { data: deals, isLoading } = useQuery({
    queryKey: ['business-deals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('created_by', user!.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading deals...</p>;
  }

  if (!deals || deals.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No deals yet. Create your first deal to attract students!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deals.map((deal) => (
        <div key={deal.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{deal.title}</h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{deal.description}</p>
            </div>
            <Badge variant={deal.is_active ? 'default' : 'secondary'}>
              {deal.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {deal.discount_percentage && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{deal.discount_percentage}% OFF</span>
              </div>
            )}
            {deal.valid_until && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Expires: {new Date(deal.valid_until).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};