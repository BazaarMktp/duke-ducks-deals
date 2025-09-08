-- Create performance metrics table for Web Vitals
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  page_url TEXT NOT NULL,
  metric_name TEXT NOT NULL CHECK (metric_name IN ('LCP', 'FCP', 'CLS', 'INP', 'TTFB')),
  value NUMERIC NOT NULL,
  rating TEXT NOT NULL CHECK (rating IN ('good', 'needs-improvement', 'poor')),
  user_agent TEXT,
  connection_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create image performance metrics table
CREATE TABLE public.image_performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  image_url TEXT NOT NULL,
  image_size_bytes INTEGER,
  load_time_ms NUMERIC NOT NULL,
  page_url TEXT NOT NULL,
  viewport_width INTEGER,
  viewport_height INTEGER,
  is_lazy_loaded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for performance_metrics
CREATE POLICY "Users can insert their own performance metrics" 
ON public.performance_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all performance metrics" 
ON public.performance_metrics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policies for image_performance_metrics  
CREATE POLICY "Users can insert their own image metrics" 
ON public.image_performance_metrics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all image metrics" 
ON public.image_performance_metrics 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_performance_metrics_created_at ON public.performance_metrics(created_at);
CREATE INDEX idx_performance_metrics_metric_name ON public.performance_metrics(metric_name);
CREATE INDEX idx_image_performance_metrics_created_at ON public.image_performance_metrics(created_at);
CREATE INDEX idx_image_performance_metrics_page_url ON public.image_performance_metrics(page_url);