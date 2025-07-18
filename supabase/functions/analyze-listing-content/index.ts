import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzeRequest {
  listingId: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  price: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { listingId, title, description, images, category, price }: AnalyzeRequest = await req.json();

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Analyze text content using GPT-4
    const textAnalysisPrompt = `Analyze this marketplace listing and extract key features in JSON format:

Title: ${title}
Description: ${description}
Category: ${category}
Price: $${price}

Extract and return a JSON object with these fields:
- keywords: array of relevant search keywords
- brand: detected brand name or null
- condition: estimated condition (new, like-new, good, fair, poor)
- style: style descriptors (modern, vintage, casual, etc.)
- materials: detected materials
- colors: detected color mentions
- size: detected size information
- features: key product features

Return only valid JSON, no additional text.`;

    const textResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at analyzing marketplace listings and extracting structured data. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: textAnalysisPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: 500
      }),
    });

    const textResult = await textResponse.json();
    let textFeatures = {};
    
    try {
      textFeatures = JSON.parse(textResult.choices[0].message.content);
    } catch (e) {
      console.error('Failed to parse text analysis:', e);
      textFeatures = { keywords: [title.split(' ')], error: 'text_analysis_failed' };
    }

    // Analyze first image if available
    let imageFeatures = {};
    if (images && images.length > 0) {
      try {
        const imageAnalysisPrompt = `Analyze this marketplace item image and extract visual features in JSON format:

Extract and return a JSON object with:
- dominantColors: array of main colors seen
- objectType: what type of object this is
- condition: visual condition assessment (new, like-new, good, fair, poor)
- style: visual style (modern, vintage, minimalist, etc.)
- setting: where the photo was taken (indoor, outdoor, studio, etc.)
- quality: image quality assessment (high, medium, low)

Return only valid JSON, no additional text.`;

        const imageResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are an expert at analyzing product images and extracting visual features. Always respond with valid JSON only.'
              },
              {
                role: 'user',
                content: [
                  { type: 'text', text: imageAnalysisPrompt },
                  { type: 'image_url', image_url: { url: images[0] } }
                ]
              }
            ],
            temperature: 0.1,
            max_tokens: 300
          }),
        });

        const imageResult = await imageResponse.json();
        imageFeatures = JSON.parse(imageResult.choices[0].message.content);
      } catch (e) {
        console.error('Failed to analyze image:', e);
        imageFeatures = { error: 'image_analysis_failed' };
      }
    }

    // Generate text embedding
    const embeddingText = `${title} ${description} ${category}`.toLowerCase();
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: embeddingText,
      }),
    });

    const embeddingResult = await embeddingResponse.json();
    const embedding = embeddingResult.data[0].embedding;

    // Combine all AI features
    const aiFeatures = {
      textAnalysis: textFeatures,
      imageAnalysis: imageFeatures,
      analysisTimestamp: new Date().toISOString(),
      embeddingModel: 'text-embedding-3-small'
    };

    // Update listing with AI features and embedding
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from('listings')
      .update({
        ai_features: aiFeatures,
        embedding: embedding
      })
      .eq('id', listingId);

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        aiFeatures, 
        embeddingDimensions: embedding.length 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-listing-content:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});