import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DealCard } from '@/components/deals/DealCard';
import { DealCreateDialog } from '@/components/deals/DealCreateDialog';
import { EmptyDealsState } from '@/components/deals/EmptyDealsState';

export default function DevilsDeals() {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: deals, isLoading, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`
          *,
          profiles:created_by (
            full_name,
            profile_name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading deals...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            🔥 Devil's Deals
          </h1>
          <p className="text-muted-foreground">
            Exclusive discounts and offers for college students
          </p>
        </div>
        
        {isAdmin && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Deal
          </Button>
        )}
      </div>

      {deals && deals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} isAuthenticated={!!user} />
          ))}
        </div>
      ) : (
        <EmptyDealsState isAdmin={isAdmin} onCreateDeal={() => setIsCreateDialogOpen(true)} />
      )}

      <DealCreateDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          refetch();
          setIsCreateDialogOpen(false);
        }}
      />
    </div>
  );
}