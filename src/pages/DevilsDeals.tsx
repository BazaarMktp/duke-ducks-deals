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
import { Helmet } from 'react-helmet-async';
import comingSoonImage from '@/assets/devils-deals-coming-soon.png';

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
        query
          .eq('is_active', true)
          .or('valid_until.is.null,valid_until.gt.' + new Date().toISOString());
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

  return (
    <>
      <Helmet>
        <title>Devil's Deals – College Discounts Coming Soon | Bazaar Duke</title>
        <meta name="description" content="Exclusive student discounts and local deals coming soon to Bazaar Duke. Get notified when Devil's Deals launches." />
        <link rel="canonical" href={`${window.location.origin}/devils-deals`} />
      </Helmet>
      <main className="container mx-auto px-4 py-16">
        <section className="flex flex-col items-center text-center">
          <h1 className="sr-only">Devil's Deals – Coming Soon</h1>
          <img
            src={comingSoonImage}
            alt="Devil's Deals coming soon graphic for Bazaar Duke"
            loading="lazy"
            className="w-full max-w-4xl rounded-xl shadow"
          />
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl">
            We're crafting exclusive student discounts and partnerships with local businesses. Check back soon for incredible savings.
          </p>
        </section>
      </main>
    </>
  );
}