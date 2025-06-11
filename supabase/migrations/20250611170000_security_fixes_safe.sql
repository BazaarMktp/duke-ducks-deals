
-- Security fixes migration - safe version that handles existing policies

-- 1. Enable RLS on tables that don't have it yet (skip if already enabled)
DO $$
BEGIN
    -- Enable RLS safely
    IF NOT EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = 'banned_users' AND relrowsecurity = true
    ) THEN
        ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = 'support_tickets' AND relrowsecurity = true
    ) THEN
        ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = 'support_responses' AND relrowsecurity = true
    ) THEN
        ALTER TABLE public.support_responses ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_class 
        WHERE relname = 'app_stats' AND relrowsecurity = true
    ) THEN
        ALTER TABLE public.app_stats ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- 2. Create policies for banned_users (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'banned_users' AND policyname = 'Admins can view all banned users') THEN
        EXECUTE 'CREATE POLICY "Admins can view all banned users" ON public.banned_users FOR SELECT USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'banned_users' AND policyname = 'Admins can insert banned users') THEN
        EXECUTE 'CREATE POLICY "Admins can insert banned users" ON public.banned_users FOR INSERT WITH CHECK (public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'banned_users' AND policyname = 'Admins can update banned users') THEN
        EXECUTE 'CREATE POLICY "Admins can update banned users" ON public.banned_users FOR UPDATE USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'banned_users' AND policyname = 'Admins can delete banned users') THEN
        EXECUTE 'CREATE POLICY "Admins can delete banned users" ON public.banned_users FOR DELETE USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
END $$;

-- 3. Create policies for support_tickets
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_tickets' AND policyname = 'Users can view their own support tickets') THEN
        EXECUTE 'CREATE POLICY "Users can view their own support tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_tickets' AND policyname = 'Users can create support tickets') THEN
        EXECUTE 'CREATE POLICY "Users can create support tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_tickets' AND policyname = 'Users can update their own tickets, admins can update all') THEN
        EXECUTE 'CREATE POLICY "Users can update their own tickets, admins can update all" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_tickets' AND policyname = 'Admins can delete support tickets') THEN
        EXECUTE 'CREATE POLICY "Admins can delete support tickets" ON public.support_tickets FOR DELETE USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
END $$;

-- 4. Create policies for support_responses
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_responses' AND policyname = 'Users can view responses to their tickets') THEN
        EXECUTE 'CREATE POLICY "Users can view responses to their tickets" ON public.support_responses FOR SELECT USING (EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_id AND user_id = auth.uid()) OR public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_responses' AND policyname = 'Admins can create responses') THEN
        EXECUTE 'CREATE POLICY "Admins can create responses" ON public.support_responses FOR INSERT WITH CHECK (public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_responses' AND policyname = 'Admins can update responses') THEN
        EXECUTE 'CREATE POLICY "Admins can update responses" ON public.support_responses FOR UPDATE USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'support_responses' AND policyname = 'Admins can delete responses') THEN
        EXECUTE 'CREATE POLICY "Admins can delete responses" ON public.support_responses FOR DELETE USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
END $$;

-- 5. Create policies for app_stats
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'app_stats' AND policyname = 'Admins can view app stats') THEN
        EXECUTE 'CREATE POLICY "Admins can view app stats" ON public.app_stats FOR SELECT USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'app_stats' AND policyname = 'Admins can insert app stats') THEN
        EXECUTE 'CREATE POLICY "Admins can insert app stats" ON public.app_stats FOR INSERT WITH CHECK (public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'app_stats' AND policyname = 'Admins can update app stats') THEN
        EXECUTE 'CREATE POLICY "Admins can update app stats" ON public.app_stats FOR UPDATE USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'app_stats' AND policyname = 'Admins can delete app stats') THEN
        EXECUTE 'CREATE POLICY "Admins can delete app stats" ON public.app_stats FOR DELETE USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
END $$;

-- 6. Add missing profile policy
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can delete their own profile') THEN
        EXECUTE 'CREATE POLICY "Users can delete their own profile" ON public.profiles FOR DELETE USING (auth.uid() = id)';
    END IF;
END $$;

-- 7. Add conversation policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'Users can update conversations they are part of') THEN
        EXECUTE 'CREATE POLICY "Users can update conversations they are part of" ON public.conversations FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'Users can delete conversations they are part of') THEN
        EXECUTE 'CREATE POLICY "Users can delete conversations they are part of" ON public.conversations FOR DELETE USING (auth.uid() = buyer_id OR auth.uid() = seller_id)';
    END IF;
END $$;

-- 8. Add message policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can update their own messages') THEN
        EXECUTE 'CREATE POLICY "Users can update their own messages" ON public.messages FOR UPDATE USING (auth.uid() = sender_id)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can delete their own messages') THEN
        EXECUTE 'CREATE POLICY "Users can delete their own messages" ON public.messages FOR DELETE USING (auth.uid() = sender_id)';
    END IF;
END $$;

-- 9. Add admin listing policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listings' AND policyname = 'Admins can view all listings for management') THEN
        EXECUTE 'CREATE POLICY "Admins can view all listings for management" ON public.listings FOR SELECT USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listings' AND policyname = 'Admins can update any listing') THEN
        EXECUTE 'CREATE POLICY "Admins can update any listing" ON public.listings FOR UPDATE USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'listings' AND policyname = 'Admins can delete any listing') THEN
        EXECUTE 'CREATE POLICY "Admins can delete any listing" ON public.listings FOR DELETE USING (public.has_role(auth.uid(), ''admin''))';
    END IF;
END $$;

-- 10. Add email validation function
CREATE OR REPLACE FUNCTION public.validate_duke_email()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS NOT NULL AND NOT (NEW.email LIKE '%@duke.edu' OR NEW.email = 'info@thebazaarapp.com') THEN
    RAISE EXCEPTION 'Email must be a valid Duke email address (@duke.edu) or admin email';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for email validation (drop if exists first)
DROP TRIGGER IF EXISTS validate_email_trigger ON public.profiles;
CREATE TRIGGER validate_email_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_duke_email();

-- 11. Create audit logging table (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin_audit_log') THEN
        CREATE TABLE public.admin_audit_log (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          admin_user_id UUID REFERENCES public.profiles(id) NOT NULL,
          action TEXT NOT NULL,
          target_table TEXT,
          target_id UUID,
          old_values JSONB,
          new_values JSONB,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Admins can view audit logs" ON public.admin_audit_log
          FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
        
        CREATE POLICY "System can insert audit logs" ON public.admin_audit_log
          FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- 12. Add foreign key constraints safely (only if they don't exist)
DO $$
BEGIN
    -- Add foreign key constraints only if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_banned_users_user_id') THEN
        ALTER TABLE public.banned_users ADD CONSTRAINT fk_banned_users_user_id 
          FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_banned_users_banned_by') THEN
        ALTER TABLE public.banned_users ADD CONSTRAINT fk_banned_users_banned_by 
          FOREIGN KEY (banned_by) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_support_tickets_user_id') THEN
        ALTER TABLE public.support_tickets ADD CONSTRAINT fk_support_tickets_user_id 
          FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_support_responses_ticket_id') THEN
        ALTER TABLE public.support_responses ADD CONSTRAINT fk_support_responses_ticket_id 
          FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_support_responses_responder_id') THEN
        ALTER TABLE public.support_responses ADD CONSTRAINT fk_support_responses_responder_id 
          FOREIGN KEY (responder_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;
