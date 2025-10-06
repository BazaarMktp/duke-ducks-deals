import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    // Get user's browsing history (favorites, cart items, conversations)
    const [favorites, cartItems, conversations] = await Promise.all([
      supabase.from('favorites').select('listing_id').eq('user_id', userId).limit(10),
      supabase.from('cart_items').select('listing_id').eq('user_id', userId).limit(10),
      supabase.from('conversations').select('listing_id').eq('buyer_id', userId).limit(10)
    ]);

    const interactedListingIds = [
      ...(favorites.data?.map(f => f.listing_id) || []),
      ...(cartItems.data?.map(c => c.listing_id) || []),
      ...(conversations.data?.map(c => c.listing_id).filter(Boolean) || [])
    ];

    if (interactedListingIds.length === 0) {
      // New user - return trending items
      const { data: trending } = await supabase
        .from('listings')
        .select('id, title, category, price, description')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      return new Response(JSON.stringify({ recommendations: trending || [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get details of interacted listings
    const { data: interactedListings } = await supabase
      .from('listings')
      .select('title, category, price, description')
      .in('id', interactedListingIds);

    // Get all active listings
    const { data: activeListings } = await supabase
      .from('listings')
      .select('id, title, category, price, description, user_id')
      .eq('status', 'active')
      .not('id', 'in', `(${interactedListingIds.join(',')})`)
      .neq('user_id', userId)
      .limit(50);

    const prompt = `Based on user's browsing history, recommend 10 relevant listings:

User's interested listings:
${JSON.stringify(interactedListings, null, 2)}

Available listings:
${JSON.stringify(activeListings?.map(l => ({ id: l.id, title: l.title, category: l.category, price: l.price })), null, 2)}

Return JSON array of listing IDs ordered by relevance: ["id1", "id2", ...]`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: 'You are a recommendation engine for a campus marketplace. Analyze user preferences and suggest relevant items.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    const recommendedIds = JSON.parse(content.match(/\[[\s\S]*\]/)?.[0] || '[]');

    const recommendations = activeListings?.filter(l => recommendedIds.includes(l.id)) || [];

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in personalized-recommendations:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
