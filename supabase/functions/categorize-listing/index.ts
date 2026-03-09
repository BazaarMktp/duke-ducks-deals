import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Map AI-returned specific tags to canonical filter categories
const TAG_NORMALIZATION: Record<string, string> = {
  microwave: 'microwave',
  'microwave oven': 'microwave',
  fridge: 'fridge',
  refrigerator: 'fridge',
  'mini fridge': 'fridge',
  furniture: 'furniture',
  desk: 'furniture',
  chair: 'furniture',
  bed: 'furniture',
  couch: 'furniture',
  sofa: 'furniture',
  table: 'furniture',
  shelf: 'furniture',
  dresser: 'furniture',
  nightstand: 'furniture',
  bookshelf: 'furniture',
  futon: 'furniture',
  mattress: 'furniture',
  lamp: 'furniture',
  fan: 'furniture',
  'dorm decor': 'dorm decor',
  decor: 'dorm decor',
  poster: 'dorm decor',
  tapestry: 'dorm decor',
  rug: 'dorm decor',
  mirror: 'dorm decor',
  textbook: 'books',
  book: 'books',
  books: 'books',
  novel: 'books',
  clothes: 'clothes',
  clothing: 'clothes',
  shirt: 'clothes',
  shoes: 'clothes',
  sneakers: 'clothes',
  hoodie: 'clothes',
  jacket: 'clothes',
  technology: 'technology',
  tech: 'technology',
  laptop: 'technology',
  computer: 'technology',
  monitor: 'technology',
  keyboard: 'technology',
  mouse: 'technology',
  phone: 'technology',
  tablet: 'technology',
  ipad: 'technology',
  macbook: 'technology',
  headphones: 'technology',
  speaker: 'technology',
  tv: 'technology',
  television: 'technology',
  camera: 'technology',
  console: 'technology',
  gaming: 'technology',
  other: 'other',
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
      .select('title, description, images, category, item_tag')
      .eq('id', listingId)
      .single();

    if (listingError) throw listingError;

    // If item_tag is already set by the user, skip AI categorization
    if (listing.item_tag) {
      console.log('Listing', listingId, 'already has item_tag:', listing.item_tag);
      return new Response(JSON.stringify({ tag: listing.item_tag, source: 'user' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
6. Do NOT categorize based on incidental mentions in the description (e.g. a room rental mentioning "microwave included" is NOT a microwave listing)

Available canonical categories: "microwave", "fridge", "furniture", "dorm decor", "books", "clothes", "technology", "other"

Respond with ONLY the category tag, nothing else.`
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
    const rawTag = data.choices[0].message.content.trim().toLowerCase();

    // Normalize the AI tag to a canonical category
    const normalizedTag = TAG_NORMALIZATION[rawTag] || 'other';

    console.log('Categorized listing', listingId, 'raw:', rawTag, 'normalized:', normalizedTag);

    return new Response(JSON.stringify({ tag: normalizedTag, rawTag, source: 'ai' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in categorize-listing function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
