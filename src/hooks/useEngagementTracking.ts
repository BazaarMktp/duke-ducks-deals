import { useAuth } from '@/contexts/AuthContext';
import { useGamification } from './useGamification';
import { supabase } from '@/integrations/supabase/client';

export const useEngagementTracking = () => {
  const { user } = useAuth();
  const { addXP, trackEngagement } = useGamification();

  const trackListingCreated = async (listingId: string) => {
    if (!user) return;
    
    await Promise.all([
      addXP(25, 5, 'listing_created'),
      trackEngagement('listing_created', { listing_id: listingId })
    ]);
  };

  const trackMessageSent = async (conversationId: string) => {
    if (!user) return;
    
    await Promise.all([
      addXP(5, 1, 'message_sent'),
      trackEngagement('message_sent', { conversation_id: conversationId })
    ]);
  };

  const trackItemFavorited = async (listingId: string) => {
    if (!user) return;
    
    await Promise.all([
      addXP(3, 1, 'item_favorited'),
      trackEngagement('item_favorited', { listing_id: listingId })
    ]);
  };

  const trackProfileCompleted = async () => {
    if (!user) return;
    
    await Promise.all([
      addXP(50, 10, 'profile_completed'),
      trackEngagement('profile_completed', {})
    ]);
  };

  const trackSaleCompleted = async (listingId: string, saleAmount: number) => {
    if (!user) return;
    
    const xpReward = Math.min(100, Math.floor(saleAmount / 10)); // Max 100 XP, 1 XP per $10
    const pointsReward = Math.min(20, Math.floor(saleAmount / 50)); // Max 20 points, 1 point per $50
    
    await Promise.all([
      addXP(xpReward, pointsReward, 'sale_completed'),
      trackEngagement('sale_completed', { 
        listing_id: listingId, 
        sale_amount: saleAmount 
      })
    ]);
  };

  const trackDealViewed = async (dealId: string) => {
    if (!user) return;
    
    await Promise.all([
      addXP(2, 0, 'deal_viewed'),
      trackEngagement('deal_viewed', { deal_id: dealId })
    ]);
  };

  const trackDonationMade = async (donationId: string) => {
    if (!user) return;
    
    await Promise.all([
      addXP(75, 15, 'donation_made'),
      trackEngagement('donation_made', { donation_id: donationId })
    ]);
  };

  const trackConversationStarted = async (conversationId: string, sellerId: string) => {
    if (!user) return;
    
    await Promise.all([
      addXP(10, 2, 'conversation_started'),
      trackEngagement('conversation_started', { 
        conversation_id: conversationId,
        seller_id: sellerId
      })
    ]);
  };

  const trackLoginDaily = async () => {
    if (!user) return;
    
    // Check if already logged in today
    const today = new Date().toDateString();
    const { data: todayEvents } = await supabase
      .from('user_engagement_events')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_type', 'daily_login')
      .gte('created_at', new Date(today).toISOString())
      .limit(1);

    if (!todayEvents || todayEvents.length === 0) {
      await Promise.all([
        addXP(5, 1, 'daily_login'),
        trackEngagement('daily_login', { date: today })
      ]);
    }
  };

  const trackImageUploaded = async (imageUrl: string, context: string) => {
    if (!user) return;
    
    await Promise.all([
      addXP(5, 1, 'image_uploaded'),
      trackEngagement('image_uploaded', { 
        image_url: imageUrl,
        context 
      })
    ]);
  };

  const trackSearchPerformed = async (query: string, resultsCount: number) => {
    if (!user) return;
    
    await trackEngagement('search_performed', { 
      query,
      results_count: resultsCount
    });
  };

  return {
    trackListingCreated,
    trackMessageSent,
    trackItemFavorited,
    trackProfileCompleted,
    trackSaleCompleted,
    trackDealViewed,
    trackDonationMade,
    trackConversationStarted,
    trackLoginDaily,
    trackImageUploaded,
    trackSearchPerformed
  };
};