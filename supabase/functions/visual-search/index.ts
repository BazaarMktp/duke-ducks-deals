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
    const { imageUrl, imageBase64 } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    // Use Gemini's vision capabilities
    const imageContent = imageBase64 || imageUrl;
    const isBase64 = !!imageBase64;

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
            content: 'Analyze images to identify products and suggest marketplace categories. Be specific and concise.' 
          },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: 'Identify this item and suggest: 1) Best marketplace category (marketplace/housing/services) 2) Item name 3) Key features 4) Search keywords. Return as JSON: { "category": "...", "itemName": "...", "features": ["..."], "keywords": ["..."] }' },
              { 
                type: 'image_url', 
                image_url: { 
                  url: isBase64 ? `data:image/jpeg;base64,${imageContent}` : imageContent 
                } 
              }
            ]
          }
        ],
      }),
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!analysis) {
      throw new Error('Could not analyze image');
    }

    // Search for similar listings based on analysis
    const { data: similarListings } = await supabase
      .from('listings')
      .select('id, title, category, price, images, description')
      .eq('status', 'active')
      .eq('category', analysis.category)
      .limit(20);

    // Use AI to rank similarity
    const rankPrompt = `Based on this image analysis:
${JSON.stringify(analysis)}

Rank these listings by visual/feature similarity (most similar first):
${JSON.stringify(similarListings?.map(l => ({ id: l.id, title: l.title, description: l.description })))}

Return array of listing IDs ordered by similarity: ["id1", "id2", ...]`;

    const rankResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a product similarity expert. Rank items by visual and feature similarity.' },
          { role: 'user', content: rankPrompt }
        ],
      }),
    });

    const rankData = await rankResponse.json();
    const rankedIds = JSON.parse(rankData.choices[0].message.content.match(/\[[\s\S]*\]/)?.[0] || '[]');

    const results = rankedIds
      .map((id: string) => similarListings?.find(l => l.id === id))
      .filter(Boolean)
      .slice(0, 10);

    return new Response(JSON.stringify({ analysis, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in visual-search:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
