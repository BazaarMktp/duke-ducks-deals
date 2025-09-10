-- Create deal metrics table to track page visits and deal clicks
CREATE TABLE public.deal_metrics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id uuid REFERENCES public.deals(id) ON DELETE CASCADE,
  user_id uuid NULL, -- Allow anonymous tracking
  metric_type text NOT NULL CHECK (metric_type IN ('page_visit', 'deal_click', 'deal_view')),
  page_url text,
  user_agent text,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.deal_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert deal metrics" 
ON public.deal_metrics 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all deal metrics" 
ON public.deal_metrics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for better performance
CREATE INDEX idx_deal_metrics_deal_id ON public.deal_metrics(deal_id);
CREATE INDEX idx_deal_metrics_type_created ON public.deal_metrics(metric_type, created_at);
CREATE INDEX idx_deal_metrics_user_id ON public.deal_metrics(user_id);

-- Add analytics function to get deal metrics
CREATE OR REPLACE FUNCTION public.get_deal_analytics(deal_id_param uuid DEFAULT NULL)
RETURNS TABLE(
  deal_id uuid,
  total_page_visits bigint,
  total_deal_clicks bigint,
  total_deal_views bigint,
  unique_visitors bigint,
  latest_activity timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    COALESCE(dm.deal_id, deal_id_param) as deal_id,
    COUNT(*) FILTER (WHERE dm.metric_type = 'page_visit') as total_page_visits,
    COUNT(*) FILTER (WHERE dm.metric_type = 'deal_click') as total_deal_clicks,
    COUNT(*) FILTER (WHERE dm.metric_type = 'deal_view') as total_deal_views,
    COUNT(DISTINCT dm.user_id) FILTER (WHERE dm.user_id IS NOT NULL) as unique_visitors,
    MAX(dm.created_at) as latest_activity
  FROM public.deal_metrics dm
  WHERE (deal_id_param IS NULL OR dm.deal_id = deal_id_param)
  GROUP BY COALESCE(dm.deal_id, deal_id_param);
$function$;