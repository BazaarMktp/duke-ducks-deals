import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DealCard } from '@/components/deals/DealCard';
import { DealCreateDialog } from '@/components/deals/DealCreateDialog';
import { DealEditDialog } from '@/components/deals/DealEditDialog';
import { EmptyDealsState } from '@/components/deals/EmptyDealsState';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  business_website?: string;
  business_phone?: string;
  business_email?: string;
  terms_and_conditions?: string;
}

export default function DevilsDeals() {
  const { user } = useAuth();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState<string | null>(null);

  const { data: deals, isLoading, refetch } = useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const query = supabase.from('deals').select('*');
      
      // Admins see all deals, regular users see only active and non-expired deals
      if (!isAdmin) {
        query.eq('is_active', true);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteDealMutation = useMutation({
    mutationFn: async (dealId: string) => {
      const { error } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Deal deleted successfully!',
      });
      refetch();
      setDeleteDialogOpen(false);
      setDealToDelete(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete deal',
        variant: 'destructive',
      });
    },
  });

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDeal = (dealId: string) => {
    setDealToDelete(dealId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      deleteDealMutation.mutate(dealToDelete);
    }
  };

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
            <DealCard 
              key={deal.id} 
              deal={deal} 
              isAuthenticated={!!user}
              isAdmin={isAdmin}
              onEdit={handleEditDeal}
              onDelete={handleDeleteDeal}
            />
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

      <DealEditDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        deal={editingDeal}
        onSuccess={() => {
          refetch();
          setIsEditDialogOpen(false);
          setEditingDeal(null);
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this deal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}