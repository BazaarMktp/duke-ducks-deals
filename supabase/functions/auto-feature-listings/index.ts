import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting automated featuring process...');

    // Call the database function to auto-feature desirable listings
    const { data: updatedCount, error } = await supabaseClient
      .rpc('auto_feature_desirable_listings');

    if (error) {
      console.error('Error running auto-feature function:', error);
      throw error;
    }

    console.log(`Successfully featured ${updatedCount} listings`);

    // Get the currently featured listings for the response
    const { data: featuredListings, error: fetchError } = await supabaseClient
      .from('listings')
      .select(`
        id,
        title,
        price,
        category,
        created_at,
        profiles!user_id(profile_name)
      `)
      .eq('featured', true)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching featured listings:', fetchError);
      throw fetchError;
    }

    const response = {
      success: true,
      message: `Successfully featured ${updatedCount} listings`,
      featuredCount: updatedCount,
      featuredListings: featuredListings || [],
      timestamp: new Date().toISOString()
    };

    console.log('Auto-featuring completed successfully:', response);

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Auto-featuring failed:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});