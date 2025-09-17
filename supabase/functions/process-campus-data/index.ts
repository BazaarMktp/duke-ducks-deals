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
    const { sources } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing campus data from sources:', sources?.length || 'all active');

    // Get active sources if none specified
    const { data: scrapeSources, error: sourcesError } = await supabase
      .from('scraped_sources')
      .select('*')
      .eq('is_active', true);

    if (sourcesError) {
      console.error('Error fetching sources:', sourcesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch sources' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const results = [];

    for (const source of scrapeSources) {
      try {
        console.log(`Processing source: ${source.name}`);
        
        // Simulate web scraping (replace with actual scraping logic)
        const mockEvents = await generateMockEvents(source);
        
        // Process events with AI
        const processedEvents = await processEventsWithAI(mockEvents);
        
        // Store events in database
        for (const event of processedEvents) {
          const { data, error } = await supabase
            .from('campus_events')
            .upsert({
              title: event.title,
              description: event.description,
              event_type: event.type,
              location: event.location,
              start_time: event.startTime,
              end_time: event.endTime,
              source_url: source.url,
              tags: event.tags,
              relevance_score: event.relevanceScore,
              is_active: true
            }, {
              onConflict: 'title,start_time'
            });

          if (error) {
            console.error('Error storing event:', error);
          } else {
            results.push(data);
          }
        }

        // Update last scraped timestamp
        await supabase
          .from('scraped_sources')
          .update({ last_scraped: new Date().toISOString() })
          .eq('id', source.id);

      } catch (error) {
        console.error(`Error processing source ${source.name}:`, error);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processed: results.length,
      message: `Processed ${results.length} events from ${scrapeSources.length} sources`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-campus-data function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateMockEvents(source: any) {
  // This would be replaced with actual web scraping logic
  const eventTypes = ['food', 'academic', 'social', 'deadline', 'career'];
  const events = [];
  
  for (let i = 0; i < 3; i++) {
    events.push({
      title: `${source.name} Event ${i + 1}`,
      description: `Sample event from ${source.name}`,
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      location: 'Duke Campus',
      startTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      tags: ['duke', 'campus'],
      relevanceScore: Math.random()
    });
  }
  
  return events;
}

async function processEventsWithAI(events: any[]) {
  const processedEvents = [];

  for (const event of events) {
    try {
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
              content: `You are an AI that categorizes and enhances campus events. Analyze the event and return a JSON object with:
              - enhanced_description: A more detailed, engaging description
              - category: One of [food, academic, social, deadline, career, sports, wellness]
              - urgency: Number 1-10 (how urgent/important this is)
              - target_audience: Array of student types this appeals to
              - enhanced_tags: Array of relevant tags`
            },
            {
              role: 'user',
              content: `Event: ${event.title}\nDescription: ${event.description}\nType: ${event.type}`
            }
          ],
          temperature: 0.3,
        }),
      });

      const aiResponse = await response.json();
      
      if (aiResponse.choices?.[0]?.message?.content) {
        try {
          const enhancement = JSON.parse(aiResponse.choices[0].message.content);
          
          processedEvents.push({
            ...event,
            description: enhancement.enhanced_description || event.description,
            type: enhancement.category || event.type,
            relevanceScore: (enhancement.urgency || 5) / 10,
            tags: [...event.tags, ...(enhancement.enhanced_tags || [])],
            targetAudience: enhancement.target_audience || []
          });
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          processedEvents.push(event);
        }
      } else {
        processedEvents.push(event);
      }
    } catch (error) {
      console.error('Error processing event with AI:', error);
      processedEvents.push(event);
    }
  }

  return processedEvents;
}