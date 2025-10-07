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
    const { title, category, condition, description } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    // Fetch similar listings from same category
    const { data: similarListings } = await supabase
      .from('listings')
      .select('title, price, description')
      .eq('category', category)
      .not('price', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20);

    const priceData = similarListings?.map(l => ({
      title: l.title,
      price: l.price
    })) || [];

    const prompt = `Analyze this campus marketplace listing and suggest a fair price:

Title: ${title}
Category: ${category}
Condition: ${condition || 'Not specified'}
Description: ${description}

Similar listings in category:
${JSON.stringify(priceData, null, 2)}

Provide:
1. Suggested price range (min-max)
2. Recommended price
3. Brief justification (2-3 sentences)

Return as JSON: { "min": number, "max": number, "recommended": number, "justification": "string" }`;

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
            content: 'You are a price analysis expert for a campus marketplace. Provide fair, data-driven pricing suggestions.' 
          },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const priceSuggestion = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    return new Response(JSON.stringify(priceSuggestion), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in price-intelligence:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
