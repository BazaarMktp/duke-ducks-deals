import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CATEGORIES = [
  'textbooks',
  'electronics', 
  'furniture',
  'clothing',
  'vehicles',
  'housing',
  'services',
  'tickets',
  'other'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, images } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = `Analyze this marketplace listing and suggest the most appropriate category from: ${CATEGORIES.join(', ')}.

Title: "${title}"
Description: "${description || 'No description provided'}"

Respond with just the category name from the list above.`;

    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that categorizes marketplace listings. Always respond with exactly one category from the provided list.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    // If images are provided, analyze the first image
    if (images && images.length > 0) {
      messages[1].content = [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: images[0] } }
      ];
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages,
        max_tokens: 50,
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const suggestedCategory = data.choices[0].message.content.trim().toLowerCase();

    // Validate the suggested category
    const validCategory = CATEGORIES.includes(suggestedCategory) ? suggestedCategory : 'other';

    return new Response(JSON.stringify({ 
      category: validCategory,
      confidence: validCategory !== 'other' ? 0.9 : 0.5
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in suggest-category function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});