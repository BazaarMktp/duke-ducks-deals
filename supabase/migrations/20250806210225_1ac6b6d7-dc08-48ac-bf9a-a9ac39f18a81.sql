-- Allow admins to create conversations with any user
CREATE POLICY "Admins can create conversations with any user"
ON public.conversations
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR
  auth.uid() = buyer_id
);