import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, category, images } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    let prompt = `Generate a compelling marketplace listing description for this ${category} item titled "${title}".`;
    
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant that creates engaging marketplace listing descriptions. Keep descriptions concise (2-3 sentences), highlight key features, and make them appealing to buyers.'
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
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const generatedDescription = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ 
      description: generatedDescription,
      confidence: 0.85 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-description function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});