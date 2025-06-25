
-- Drop existing problematic RLS policies for cart_items
DROP POLICY IF EXISTS "Users can view their own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can add to their own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can update their own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can delete from their own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users can manage their own cart" ON public.cart_items;

-- Create optimized RLS policies using subqueries to avoid re-evaluation
CREATE POLICY "Users can view their own cart" ON public.cart_items
  FOR SELECT USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can add to their own cart" ON public.cart_items
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update their own cart" ON public.cart_items
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete from their own cart" ON public.cart_items
  FOR DELETE USING (user_id = (SELECT auth.uid()));
