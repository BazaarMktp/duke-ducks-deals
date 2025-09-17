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
    const { user1_id, user2_id } = await req.json();
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Calculating compatibility between users:', user1_id, user2_id);

    // Get both users' preferences
    const [user1Result, user2Result] = await Promise.all([
      supabase
        .from('roommate_preferences')
        .select('*')
        .eq('user_id', user1_id)
        .single(),
      supabase
        .from('roommate_preferences')
        .select('*')
        .eq('user_id', user2_id)
        .single()
    ]);

    if (user1Result.error || user2Result.error) {
      return new Response(JSON.stringify({ error: 'User preferences not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const user1Prefs = user1Result.data;
    const user2Prefs = user2Result.data;

    // Calculate compatibility score
    const compatibilityScore = calculateCompatibility(user1Prefs, user2Prefs);
    
    // Generate AI explanation
    const explanation = await generateAIExplanation(user1Prefs, user2Prefs, compatibilityScore);

    // Store the match
    const { data: match, error: matchError } = await supabase
      .from('roommate_matches')
      .upsert({
        user1_id,
        user2_id,
        compatibility_score: compatibilityScore,
        match_explanation: explanation,
        status: 'pending'
      }, {
        onConflict: 'user1_id,user2_id'
      })
      .select()
      .single();

    if (matchError) {
      console.error('Error storing match:', matchError);
      return new Response(JSON.stringify({ error: 'Failed to store match' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      compatibility_score: compatibilityScore,
      explanation,
      match_id: match.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in calculate-compatibility function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function calculateCompatibility(user1: any, user2: any): number {
  let score = 0;
  let maxScore = 0;

  // Budget compatibility (20% weight)
  const budgetOverlap = calculateBudgetOverlap(user1, user2);
  score += budgetOverlap * 20;
  maxScore += 20;

  // Cleanliness compatibility (15% weight)
  const cleanlinessScore = 10 - Math.abs(user1.cleanliness_level - user2.cleanliness_level);
  score += (cleanlinessScore / 10) * 15;
  maxScore += 15;

  // Sleep schedule compatibility (15% weight)
  const sleepScore = calculateSleepCompatibility(user1.sleep_schedule, user2.sleep_schedule);
  score += sleepScore * 15;
  maxScore += 15;

  // Social level compatibility (10% weight)
  const socialScore = 10 - Math.abs(user1.social_level - user2.social_level);
  score += (socialScore / 10) * 10;
  maxScore += 10;

  // Study habits compatibility (10% weight)
  const studyScore = calculateStudyCompatibility(user1.study_habits, user2.study_habits);
  score += studyScore * 10;
  maxScore += 10;

  // Noise tolerance (10% weight)
  const noiseScore = 10 - Math.abs(user1.noise_tolerance - user2.noise_tolerance);
  score += (noiseScore / 10) * 10;
  maxScore += 10;

  // Pet/smoking/guest preferences (10% weight each)
  score += (user1.pet_friendly === user2.pet_friendly ? 1 : 0) * 5;
  score += (user1.smoking_ok === user2.smoking_ok ? 1 : 0) * 5;
  score += (user1.guests_ok === user2.guests_ok ? 1 : 0) * 5;
  maxScore += 15;

  // Location preference (5% weight)
  const locationScore = user1.preferred_location === user2.preferred_location ? 1 : 0.5;
  score += locationScore * 5;
  maxScore += 5;

  return Math.round((score / maxScore) * 100);
}

function calculateBudgetOverlap(user1: any, user2: any): number {
  if (!user1.budget_min || !user1.budget_max || !user2.budget_min || !user2.budget_max) {
    return 0.5; // Default if budget not specified
  }

  const overlap = Math.max(0, Math.min(user1.budget_max, user2.budget_max) - Math.max(user1.budget_min, user2.budget_min));
  const totalRange = Math.max(user1.budget_max, user2.budget_max) - Math.min(user1.budget_min, user2.budget_min);
  
  return totalRange > 0 ? overlap / totalRange : 0;
}

function calculateSleepCompatibility(schedule1: string, schedule2: string): number {
  const compatibility = {
    'early_bird': { 'early_bird': 1, 'flexible': 0.7, 'night_owl': 0.3 },
    'flexible': { 'early_bird': 0.7, 'flexible': 1, 'night_owl': 0.7 },
    'night_owl': { 'early_bird': 0.3, 'flexible': 0.7, 'night_owl': 1 }
  };

  return compatibility[schedule1]?.[schedule2] || 0.5;
}

function calculateStudyCompatibility(habits1: string, habits2: string): number {
  const compatibility = {
    'quiet': { 'quiet': 1, 'flexible': 0.8, 'collaborative': 0.4 },
    'flexible': { 'quiet': 0.8, 'flexible': 1, 'collaborative': 0.8 },
    'collaborative': { 'quiet': 0.4, 'flexible': 0.8, 'collaborative': 1 }
  };

  return compatibility[habits1]?.[habits2] || 0.5;
}

async function generateAIExplanation(user1: any, user2: any, score: number): Promise<any> {
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
            content: `You are a roommate compatibility expert. Analyze two users' preferences and explain their compatibility. Return a JSON object with:
            - summary: Brief 1-2 sentence compatibility summary
            - strengths: Array of 2-3 compatibility strengths
            - potential_challenges: Array of 1-2 potential issues
            - tips: Array of 2-3 tips for successful cohabitation`
          },
          {
            role: 'user',
            content: `Compatibility Score: ${score}%
            
            User 1: Budget $${user1.budget_min}-${user1.budget_max}, Cleanliness ${user1.cleanliness_level}/10, Sleep: ${user1.sleep_schedule}, Social: ${user1.social_level}/10, Study: ${user1.study_habits}, Pets: ${user1.pet_friendly}
            
            User 2: Budget $${user2.budget_min}-${user2.budget_max}, Cleanliness ${user2.cleanliness_level}/10, Sleep: ${user2.sleep_schedule}, Social: ${user2.social_level}/10, Study: ${user2.study_habits}, Pets: ${user2.pet_friendly}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const aiResponse = await response.json();
    
    if (aiResponse.choices?.[0]?.message?.content) {
      return JSON.parse(aiResponse.choices[0].message.content);
    }
  } catch (error) {
    console.error('Error generating AI explanation:', error);
  }

  // Fallback explanation
  return {
    summary: `You have a ${score}% compatibility score based on your preferences.`,
    strengths: ['Similar lifestyle preferences', 'Compatible living habits'],
    potential_challenges: ['Different preferences in some areas'],
    tips: ['Communicate openly about expectations', 'Be flexible and understanding']
  };
}