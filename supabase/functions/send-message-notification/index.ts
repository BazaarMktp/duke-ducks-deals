import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MessageNotificationRequest {
  conversationId: string;
  senderId: string;
  message: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Validate JWT - extract user from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use getUser() which is the correct v2 method for JWT validation
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: authUser }, error: authError } = await authClient.auth.getUser();

    if (authError || !authUser) {
      console.error('JWT validation failed:', authError?.message);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { conversationId, senderId, message }: MessageNotificationRequest = await req.json();
    console.log('Processing notification for conversation:', conversationId, 'sender:', senderId);

    // Ensure the authenticated user matches the claimed senderId
    if (authUser.id !== senderId) {
      console.error('Sender mismatch: auth=', authUser.id, 'claimed=', senderId);
      return new Response(JSON.stringify({ error: 'Forbidden: sender mismatch' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use service role client for data lookups
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get conversation + sender profile in parallel
    const [conversationResult, senderResult] = await Promise.all([
      supabase.from('conversations').select('id, buyer_id, seller_id').eq('id', conversationId).single(),
      supabase.from('profiles').select('profile_name, email').eq('id', senderId).single(),
    ]);

    if (conversationResult.error || !conversationResult.data) {
      console.error('Conversation not found:', conversationResult.error?.message);
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (senderResult.error || !senderResult.data) {
      console.error('Sender not found:', senderResult.error?.message);
      return new Response(JSON.stringify({ error: 'Sender not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const conversation = conversationResult.data;
    const senderProfile = senderResult.data;

    // Determine recipient
    const recipientId = senderId === conversation.buyer_id
      ? conversation.seller_id
      : conversation.buyer_id;

    // Prevent self-notification
    if (recipientId === senderId) {
      console.log('Sender equals recipient, skipping notification');
      return new Response(JSON.stringify({ success: true, message: 'Self-message, no notification' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get recipient profile + email preferences in parallel
    const [recipientResult, emailPrefsResult] = await Promise.all([
      supabase.from('profiles').select('profile_name, email').eq('id', recipientId).single(),
      supabase.from('email_preferences').select('message_notifications').eq('user_id', recipientId).single(),
    ]);

    if (recipientResult.error || !recipientResult.data) {
      console.error('Recipient not found:', recipientResult.error?.message);
      return new Response(JSON.stringify({ error: 'Recipient not found' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const recipientProfile = recipientResult.data;

    // Create in-app notification
    const { error: notifError } = await supabase.from('notifications').insert({
      user_id: recipientId,
      type: 'new_message',
      title: 'New message',
      message: `${senderProfile.profile_name} sent you a message`,
      link: '/messages',
      metadata: { conversation_id: conversationId, sender_id: senderId },
    });
    if (notifError) {
      console.error('Failed to create in-app notification:', notifError.message);
      // Non-fatal — continue to email
    } else {
      console.log('In-app notification created for', recipientId);
    }

    // Check email preferences
    const emailPrefs = emailPrefsResult.data;
    if (emailPrefs && emailPrefs.message_notifications === false) {
      console.log('User disabled message email notifications, skipping email');
      return new Response(JSON.stringify({ success: true, message: 'Notifications disabled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!recipientProfile.email) {
      console.log('No recipient email found, skipping');
      return new Response(JSON.stringify({ success: true, message: 'No email to notify' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Send email via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const escapedName = escapeHtml(recipientProfile.profile_name);
    const escapedSender = escapeHtml(senderProfile.profile_name);
    const escapedMessage = escapeHtml(message || '');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #003087, #001a4d); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">You received a new message on Devil's Marketplace</h1>
        </div>
        <div style="background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 20px;">
          <p style="margin: 0 0 16px 0; font-size: 16px;">Hi ${escapedName},</p>
          <p style="margin: 0 0 16px 0;">You received a new message from <strong>${escapedSender}</strong> regarding your listing.</p>
          ${escapedMessage ? `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-style: italic; color: #475569;">"${escapedMessage}"</p>
          </div>` : ''}
          <p style="margin: 0 0 16px 0;">Log in to Devil's Marketplace to reply.</p>
          <p style="margin: 16px 0 0 0; text-align: center;">
            <a href="https://devils-marketplace.lovable.app/messages"
               style="background: #003087; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              View Message
            </a>
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 14px; color: #6b7280; text-align: center;">
            You can manage your notification preferences in your account settings.
          </p>
        </div>
      </div>`;

    console.log('Sending email to:', recipientProfile.email);

    // Use fetch directly for Resend API — avoids npm import issues in Deno
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "Devil's Marketplace <info@devilsmarketplace.com>",
        to: [recipientProfile.email],
        subject: "You received a new message on Devil's Marketplace",
        html: emailHtml,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend API error:', JSON.stringify(resendData));

      // Retry with default Resend domain if domain not verified
      if (resendData?.message?.includes('domain') || resendData?.message?.includes('verified')) {
        console.log('Retrying with Resend default domain...');
        const retryRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: "Devil's Marketplace <onboarding@resend.dev>",
            to: [recipientProfile.email],
            subject: "You received a new message on Devil's Marketplace",
            html: emailHtml,
          }),
        });
        const retryData = await retryRes.json();
        if (!retryRes.ok) {
          console.error('Retry also failed:', JSON.stringify(retryData));
          return new Response(JSON.stringify({ error: 'Email delivery failed' }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        console.log('Email sent via retry:', retryData.id);
        return new Response(JSON.stringify({ success: true, emailId: retryData.id, method: 'retry' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'Email delivery failed' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Email sent successfully:', resendData.id);

    return new Response(JSON.stringify({
      success: true,
      emailId: resendData.id,
      recipient: recipientProfile.email,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unhandled error in send-message-notification:', error?.message || error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
