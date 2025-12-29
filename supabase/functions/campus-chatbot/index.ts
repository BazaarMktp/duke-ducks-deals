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
    const { messages, userId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    // Get user's college info for context
    const { data: profile } = await supabase
      .from('profiles')
      .select('college_id, colleges(name)')
      .eq('id', userId)
      .single();

    // Get recent active listings for context
    const { data: recentListings } = await supabase
      .from('listings')
      .select('title, category, price')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(20);

    const systemPrompt = `You are the Devils Marketplace Campus Concierge, an AI assistant for a college marketplace app.

Campus: ${profile?.colleges?.name || 'Campus'}

Your capabilities:
- Answer questions about buying/selling on Devils Marketplace
- Help users find listings (search by category, price, condition)
- Explain how to post items, meet safely, and use features
- Provide campus-specific marketplace tips
- Be friendly, concise, and helpful

Available categories: marketplace, housing, services
Recent listings context: ${JSON.stringify(recentListings?.slice(0, 10))}

Guidelines:
- Keep responses under 100 words unless explaining a process
- Always prioritize safety (meet in public, verify student ID)
- Encourage using Devils Marketplace's built-in messaging
- Don't share personal contact info
- If you can't help, suggest contacting support`;

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
          ...messages
        ],
      }),
    });

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ message: assistantMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in campus-chatbot:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
