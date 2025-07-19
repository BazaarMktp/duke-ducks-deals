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
    const { query } = await req.json();
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = `Parse this marketplace search query and extract structured search parameters: "${query}"

Extract:
- keywords: main search terms
- category: textbooks, electronics, furniture, clothing, vehicles, housing, services, tickets, other (or null)
- priceRange: {min: number, max: number} (or null)
- condition: new, used, fair, poor (or null)
- urgency: urgent, flexible (or null)

Respond with valid JSON only.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: 'You are a search query parser. Always respond with valid JSON containing the extracted search parameters.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    const searchParams = JSON.parse(data.choices[0].message.content.trim());

    return new Response(JSON.stringify(searchParams), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhanced-search function:', error);
    // Fallback to simple keyword search
    const { query } = await req.json();
    return new Response(JSON.stringify({ 
      keywords: query,
      category: null,
      priceRange: null,
      condition: null,
      urgency: null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});