import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SimilarListingsRequest {
  listingId: string;
  limit?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { listingId, limit = 5 }: SimilarListingsRequest = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the source listing with its embedding and features
    const { data: sourceListing, error: sourceError } = await supabase
      .from('listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (sourceError || !sourceListing) {
      throw new Error('Source listing not found');
    }

    if (!sourceListing.embedding) {
      throw new Error('Source listing has no embedding - run analysis first');
    }

    // Find similar listings using vector similarity
    const { data: similarListings, error: similarError } = await supabase.rpc(
      'find_similar_listings_by_embedding',
      {
        query_embedding: sourceListing.embedding,
        listing_id_to_exclude: listingId,
        similarity_threshold: 0.7,
        match_count: limit * 2 // Get more to filter after scoring
      }
    );

    if (similarError) {
      console.error('Vector search error:', similarError);
      // Fallback to category-based search
      const { data: fallbackListings, error: fallbackError } = await supabase
        .from('listings')
        .select(`
          *,
          profiles:user_id (
            profile_name,
            avatar_url
          )
        `)
        .eq('category', sourceListing.category)
        .eq('status', 'active')
        .neq('id', listingId)
        .neq('user_id', sourceListing.user_id)
        .limit(limit);

      return new Response(
        JSON.stringify({
          recommendations: fallbackError ? [] : fallbackListings?.slice(0, limit) || [],
          method: 'category_fallback',
          error: 'vector_search_failed'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Calculate comprehensive similarity scores
    const recommendations = (similarListings || [])
      .map((listing: any) => {
        let totalScore = listing.similarity || 0;
        let reasoning = ['Similar text content'];

        // Price similarity bonus (within 50% range)
        if (sourceListing.price && listing.price) {
          const priceRatio = Math.min(sourceListing.price, listing.price) / 
                           Math.max(sourceListing.price, listing.price);
          if (priceRatio > 0.5) {
            totalScore += 0.1;
            reasoning.push('Similar price range');
          }
        }

        // Category exact match bonus
        if (listing.category === sourceListing.category) {
          totalScore += 0.1;
          reasoning.push('Same category');
        }

        // AI features comparison
        if (sourceListing.ai_features && listing.ai_features) {
          const sourceFeatures = sourceListing.ai_features.textAnalysis || {};
          const listingFeatures = listing.ai_features.textAnalysis || {};

          // Brand match
          if (sourceFeatures.brand && listingFeatures.brand && 
              sourceFeatures.brand.toLowerCase() === listingFeatures.brand.toLowerCase()) {
            totalScore += 0.15;
            reasoning.push(`Same brand: ${sourceFeatures.brand}`);
          }

          // Color match
          if (sourceFeatures.colors && listingFeatures.colors) {
            const colorMatches = sourceFeatures.colors.filter((color: string) =>
              listingFeatures.colors.some((c: string) => 
                c.toLowerCase().includes(color.toLowerCase()) ||
                color.toLowerCase().includes(c.toLowerCase())
              )
            );
            if (colorMatches.length > 0) {
              totalScore += 0.05 * colorMatches.length;
              reasoning.push(`Similar colors: ${colorMatches.join(', ')}`);
            }
          }

          // Condition match
          if (sourceFeatures.condition && listingFeatures.condition &&
              sourceFeatures.condition === listingFeatures.condition) {
            totalScore += 0.05;
            reasoning.push(`Same condition: ${sourceFeatures.condition}`);
          }
        }

        return {
          ...listing,
          similarity_score: Math.min(totalScore, 1.0),
          recommendation_reason: {
            score: totalScore,
            factors: reasoning,
            method: 'vector_similarity'
          }
        };
      })
      .filter((listing: any) => listing.similarity_score > 0.3)
      .sort((a: any, b: any) => b.similarity_score - a.similarity_score)
      .slice(0, limit);

    // Store recommendations for analytics
    if (recommendations.length > 0) {
      const recommendationRecords = recommendations.map((rec: any) => ({
        listing_id: listingId,
        recommended_listing_id: rec.id,
        similarity_score: rec.similarity_score,
        recommendation_reason: rec.recommendation_reason
      }));

      await supabase
        .from('listing_recommendations')
        .upsert(recommendationRecords, {
          onConflict: 'listing_id,recommended_listing_id'
        });
    }

    return new Response(
      JSON.stringify({
        recommendations,
        method: 'vector_similarity',
        sourceListingId: listingId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in find-similar-listings:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});