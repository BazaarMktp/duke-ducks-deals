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
    const { type, data } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    let prompt = '';
    let systemPrompt = 'You are a marketplace listing optimization expert helping students sell items effectively.';

    switch (type) {
      case 'improve_title':
        prompt = `Improve this listing title for maximum visibility and clicks:
Original: "${data.title}"
Category: ${data.category}

Create 3 alternative titles that are:
- Clear and specific
- Include key details (brand, condition, size if relevant)
- Under 80 characters
- Optimized for search

Return as JSON: { "suggestions": ["title1", "title2", "title3"], "reason": "brief explanation" }`;
        break;

      case 'enhance_description':
        prompt = `Enhance this listing description:
Title: ${data.title}
Category: ${data.category}
Current: "${data.description || 'No description'}"

Create an improved description (150-300 words) that:
- Highlights key features and condition
- Uses bullet points for readability
- Includes relevant details (size, brand, specifications)
- Addresses common buyer questions
- Encourages safe meetups

Return as JSON: { "description": "enhanced text", "tips": ["tip1", "tip2"] }`;
        break;

      case 'suggest_price':
        // Get similar listings
        const { data: similarListings } = await supabase
          .from('listings')
          .select('title, price, description')
          .eq('category', data.category)
          .not('price', 'is', null)
          .order('created_at', { ascending: false })
          .limit(15);

        prompt = `Suggest optimal pricing for:
Title: ${data.title}
Category: ${data.category}
Condition: ${data.condition || 'Not specified'}
Description: ${data.description}

Similar listings:
${JSON.stringify(similarListings?.map(l => ({ title: l.title, price: l.price })))}

Provide:
1. Competitive price (for quick sale)
2. Fair market price
3. Premium price (if excellent condition)
4. Pricing strategy tip

Return as JSON: { "quick": number, "fair": number, "premium": number, "strategy": "tip" }`;
        break;

      case 'optimize_images':
        prompt = `Analyze these listing images and provide optimization tips:
Number of images: ${data.imageCount}
Category: ${data.category}

Suggest:
1. Recommended total image count
2. Which angles/shots to include
3. Photo tips for this category
4. What details buyers want to see

Return as JSON: { "recommendedCount": number, "angles": ["..."], "tips": ["..."], "details": ["..."] }`;
        break;

      case 'full_analysis':
        prompt = `Comprehensive listing analysis:
${JSON.stringify(data, null, 2)}

Provide actionable improvements for:
1. Title optimization
2. Description enhancements
3. Pricing strategy
4. Image recommendations
5. Overall visibility score (0-100)

Return as JSON: { "score": number, "improvements": { "title": "...", "description": "...", "pricing": "...", "images": "..." }, "priority": ["action1", "action2"] }`;
        break;

      default:
        throw new Error('Invalid assistance type');
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

    const aiData = await response.json();
    const content = aiData.choices[0].message.content;
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: content };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in listing-assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
