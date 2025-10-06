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
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let prompt = '';
    let systemPrompt = 'You are a helpful assistant for a campus marketplace called Bazaar.';

    switch (type) {
      case 'suggest_reply':
        systemPrompt = 'Suggest 3 friendly, contextual reply options for a campus marketplace conversation. Keep them concise (max 15 words each). Return as JSON array of strings.';
        prompt = `Last message: "${context.lastMessage}"\nListing: ${context.listingTitle}\nSuggest replies:`;
        break;
      
      case 'translate':
        systemPrompt = 'Translate messages between English and the specified language. Maintain tone and context.';
        prompt = `Translate to ${context.targetLanguage}: "${context.message}"`;
        break;
      
      case 'coordinate_meeting':
        systemPrompt = 'Help coordinate safe campus meetups. Suggest public campus locations and times.';
        prompt = `Help arrange a meetup for: ${context.listingTitle}\nAvailability: ${context.availability}\nSuggest 3 options with location and time:`;
        break;
      
      default:
        throw new Error('Invalid type');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
      }),
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in smart-messaging:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
