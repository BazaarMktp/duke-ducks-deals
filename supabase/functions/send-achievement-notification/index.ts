import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AchievementNotificationRequest {
  userId: string;
  achievementName: string;
  achievementDescription: string;
  xpReward: number;
  pointsReward: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, achievementName, achievementDescription, xpReward, pointsReward }: AchievementNotificationRequest = await req.json();

    console.log('Sending achievement notification for user:', userId);

    // Get user profile and email preferences
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, profile_name, full_name')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }

    // Check email preferences
    const { data: preferences, error: prefsError } = await supabase
      .from('email_preferences')
      .select('achievement_notifications, frequency')
      .eq('user_id', userId)
      .single();

    if (prefsError && prefsError.code !== 'PGRST116') {
      console.error('Error fetching email preferences:', prefsError);
    }

    // Skip if user has disabled achievement notifications
    if (preferences && !preferences.achievement_notifications) {
      console.log('User has disabled achievement notifications');
      return new Response(JSON.stringify({ message: 'Notifications disabled' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }

    const resend = new Resend(resendApiKey);

    console.log('Sending achievement email to:', profile.email);

    // Send achievement notification email
    const emailResult = await resend.emails.send({
      from: 'Bazaar <info@thebazaarapp.com>',
      to: [profile.email],
      subject: `🎉 Achievement Unlocked: ${achievementName}!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Achievement Unlocked!</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f8fafc; padding: 30px; }
              .achievement-card { background: white; border: 2px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
              .badge { display: inline-block; background: #fbbf24; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
              .rewards { display: flex; justify-content: space-around; margin: 20px 0; }
              .reward-item { text-align: center; }
              .cta-button { background: #1e40af; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
              .footer { background: #e5e7eb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Achievement Unlocked!</h1>
                <p>Congratulations, ${profile.profile_name || profile.full_name}!</p>
              </div>
              
              <div class="content">
                <div class="achievement-card">
                  <h2>🏆 ${achievementName}</h2>
                  <p>${achievementDescription}</p>
                  <div class="badge">Achievement Complete!</div>
                </div>
                
                <div class="rewards">
                  <div class="reward-item">
                    <h3>⚡ XP Earned</h3>
                    <p><strong>+${xpReward} XP</strong></p>
                  </div>
                  ${pointsReward > 0 ? `
                  <div class="reward-item">
                    <h3>⭐ Points Earned</h3>
                    <p><strong>+${pointsReward} Points</strong></p>
                  </div>
                  ` : ''}
                </div>
                
                <p>Keep up the great work! Continue engaging with the Bazaar community to unlock more achievements and level up your profile.</p>
                
                <div style="text-align: center;">
                  <a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || '#'}/profile" class="cta-button">
                    View Your Profile
                  </a>
                </div>
              </div>
              
              <div class="footer">
                <p>© 2024 Bazaar - Campus Marketplace</p>
                <p>You received this because you have achievement notifications enabled.</p>
                <p><a href="${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'lovable.app') || '#'}/settings">Manage email preferences</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailResult.error) {
      console.error('Resend API error:', emailResult.error);
      throw new Error(`Resend API error: ${emailResult.error.message}`);
    }

    console.log('Achievement notification sent successfully:', emailResult);

    return new Response(JSON.stringify({ 
      message: 'Achievement notification sent successfully',
      emailId: emailResult.data?.id 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error sending achievement notification:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to send achievement notification' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});