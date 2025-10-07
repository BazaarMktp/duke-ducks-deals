import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { listingId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get listing details
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('title, description, images, category')
      .eq('id', listingId)
      .single();

    if (listingError) throw listingError;

    // Prepare content for Gemini
    const content = [
      {
        type: "text",
        text: `Analyze this marketplace listing and categorize it by VALIDATING the text against the actual image.

Title: ${listing.title}
Description: ${listing.description || 'No description'}

CRITICAL INSTRUCTIONS:
1. First, analyze what the image actually shows
2. Then compare it to what the title/description claims
3. ONLY return a specific category tag if the image clearly matches the text description
4. If the text says "microwave" but the image shows something else (laptop, chair, etc.), return "other"
5. If there's ANY doubt or mismatch between image and text, return "other"

Available tags: "microwave", "fridge", "furniture", "textbook", "laptop", "chair", "desk", "bed", "couch", "table", "lamp", "tv", "monitor", "keyboard", "mouse", or "other"

Respond with ONLY the tag, nothing else.`
      }
    ];

    // Add first image if available
    if (listing.images && listing.images.length > 0) {
      content.push({
        type: "image_url",
        image_url: {
          url: listing.images[0]
        }
      });
    }

    // Call Gemini via Lovable AI
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
            role: 'user',
            content: content
          }
        ],
        max_tokens: 50,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const tag = data.choices[0].message.content.trim().toLowerCase();

    console.log('Categorized listing', listingId, 'as:', tag);

    return new Response(JSON.stringify({ tag }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in categorize-listing function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
