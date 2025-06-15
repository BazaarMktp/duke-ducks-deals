
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface College {
  id: string;
  name: string;
  domain: string;
  image_url?: string;
}

export const useColleges = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .order('name');

      if (error) throw error;
      setColleges(data || []);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  return { colleges, loading };
};
