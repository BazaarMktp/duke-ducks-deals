import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openAIApiKey = Deno.env.get('OPENAI_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Generating personalized digest for user:', user_id);

    // Get user interests
    const { data: interests, error: interestsError } = await supabase
      .from('user_interests')
      .select('*')
      .eq('user_id', user_id);

    if (interestsError) {
      console.error('Error fetching user interests:', interestsError);
    }

    // Get recent events
    const { data: events, error: eventsError } = await supabase
      .from('campus_events')
      .select('*')
      .eq('is_active', true)
      .gte('start_time', new Date().toISOString())
      .lte('start_time', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('start_time', { ascending: true });

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate personalized digest using AI
    const digest = await generatePersonalizedDigest(user_id, interests || [], events || []);

    // Track interaction
    await supabase
      .from('user_event_interactions')
      .insert({
        user_id,
        event_id: null, // This is for the digest generation
        interaction_type: 'digest_generated'
      });

    return new Response(JSON.stringify({
      success: true,
      digest,
      events_count: events?.length || 0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-digest function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generatePersonalizedDigest(userId: string, interests: any[], events: any[]): Promise<any> {
  try {
    // Score events based on user interests
    const scoredEvents = events.map(event => {
      let score = event.relevance_score || 0;
      
      // Boost score based on user interests
      interests.forEach(interest => {
        if (event.event_type === interest.interest_type) {
          score += (interest.priority / 10) * 0.3;
        }
        if (event.tags?.includes(interest.interest_value.toLowerCase())) {
          score += (interest.priority / 10) * 0.2;
        }
      });

      return { ...event, user_score: Math.min(score, 1) };
    });

    // Sort by score and get top events
    const topEvents = scoredEvents
      .sort((a, b) => b.user_score - a.user_score)
      .slice(0, 10);

    // Generate AI summary
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a campus life assistant creating personalized daily digests for students. Create an engaging, concise summary that highlights the most relevant events. Return a JSON object with:
            - greeting: Personalized greeting
            - highlights: Array of 3-5 key events with engaging descriptions
            - quick_stats: Object with counts like {food_events: 2, deadlines: 1, social_events: 3}
            - fomo_alert: Most urgent/exciting thing they shouldn't miss
            - tomorrow_preview: Brief preview of tomorrow's events`
          },
          {
            role: 'user',
            content: `Events: ${JSON.stringify(topEvents.slice(0, 8).map(e => ({
              title: e.title,
              type: e.event_type,
              time: e.start_time,
              location: e.location,
              score: e.user_score
            })))}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    
    if (aiResponse.choices?.[0]?.message?.content) {
      const aiDigest = JSON.parse(aiResponse.choices[0].message.content);
      
      return {
        ...aiDigest,
        events: topEvents.slice(0, 5),
        generated_at: new Date().toISOString(),
        user_interests: interests.map(i => i.interest_type)
      };
    }
  } catch (error) {
    console.error('Error generating AI digest:', error);
  }

  // Fallback digest
  const eventsByType = events.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {});

  return {
    greeting: "Here's what's happening on campus today!",
    highlights: events.slice(0, 3).map(event => ({
      title: event.title,
      description: event.description,
      time: event.start_time,
      location: event.location,
      type: event.event_type
    })),
    quick_stats: eventsByType,
    fomo_alert: events[0]?.title || "No urgent events today",
    tomorrow_preview: "Check back tomorrow for more events!",
    events: events.slice(0, 5),
    generated_at: new Date().toISOString(),
    user_interests: interests.map(i => i.interest_type)
  };
}