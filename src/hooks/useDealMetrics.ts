import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useDealMetrics = () => {
  const { user } = useAuth();

  const trackPageVisit = async (dealId?: string) => {
    try {
      await supabase.from('deal_metrics').insert({
        deal_id: dealId || null,
        user_id: user?.id || null,
        metric_type: 'page_visit',
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track page visit:', error);
    }
  };

  const trackDealClick = async (dealId: string) => {
    try {
      await supabase.from('deal_metrics').insert({
        deal_id: dealId,
        user_id: user?.id || null,
        metric_type: 'deal_click',
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track deal click:', error);
    }
  };

  const trackDealView = async (dealId: string) => {
    try {
      await supabase.from('deal_metrics').insert({
        deal_id: dealId,
        user_id: user?.id || null,
        metric_type: 'deal_view',
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      });
    } catch (error) {
      console.error('Failed to track deal view:', error);
    }
  };

  return {
    trackPageVisit,
    trackDealClick,
    trackDealView,
  };
};