
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCollegeAutoSelect = (
  email: string, 
  isLogin: boolean, 
  setSelectedCollegeId: (id: string) => void
) => {
  useEffect(() => {
    if (!isLogin && email && email.includes('@')) {
      const domain = email.substring(email.lastIndexOf('@') + 1);
      fetchCollegeByDomain(domain);
    }
  }, [email, isLogin]);

  const fetchCollegeByDomain = async (domain: string) => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('id')
        .eq('domain', domain)
        .single();
      
      if (data) {
        setSelectedCollegeId(data.id);
      }
    } catch (error) {
      // College not found, user will need to select manually
      console.log('College not found for domain:', domain);
    }
  };
};
