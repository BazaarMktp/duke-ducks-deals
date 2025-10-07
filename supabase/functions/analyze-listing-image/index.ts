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
    const { imageUrls } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!imageUrls || imageUrls.length === 0) {
      throw new Error('No images provided');
    }

    // Prepare image content for Gemini
    const imageContent = imageUrls.slice(0, 5).map((url: string) => ({
      type: "image_url",
      image_url: { url }
    }));

    const prompt = `Analyze these product images and provide:
1. A clear, concise product title (max 60 characters)
2. A detailed description (2-3 sentences) highlighting key features, condition, and appeal
3. The product category (marketplace/housing/services)
4. Key features as an array

Return as JSON: {
  "title": "string",
  "description": "string", 
  "category": "marketplace" | "housing" | "services",
  "features": ["feature1", "feature2"],
  "confidence": 0-1
}`;

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
            content: [
              { type: 'text', text: prompt },
              ...imageContent
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error('AI analysis failed');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!analysis) {
      throw new Error('Failed to parse AI response');
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-listing-image:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
