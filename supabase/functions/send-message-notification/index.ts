import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Resend } from 'npm:resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MessageNotificationRequest {
  conversationId: string;
  senderId: string;
  message: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, senderId, message }: MessageNotificationRequest = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all required data in parallel for better performance
    const [conversationResult, senderResult] = await Promise.all([
      supabase
        .from('conversations')
        .select('id, buyer_id, seller_id')
        .eq('id', conversationId)
        .single(),
      supabase
        .from('profiles')
        .select('profile_name, email')
        .eq('id', senderId)
        .single()
    ]);

    const { data: conversation, error: conversationError } = conversationResult;
    const { data: senderProfile, error: senderError } = senderResult;

    if (conversationError || !conversation) {
      console.error('Error fetching conversation:', conversationError);
      return new Response(JSON.stringify({ error: 'Conversation not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (senderError || !senderProfile) {
      console.error('Error fetching sender profile:', senderError);
      return new Response(JSON.stringify({ error: 'Sender not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine recipient ID (the person who didn't send the message)
    const recipientId = senderId === conversation.buyer_id 
      ? conversation.seller_id 
      : conversation.buyer_id;

    // Get recipient profile and email preferences in parallel
    const [recipientResult, emailPrefsResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('profile_name, email')
        .eq('id', recipientId)
        .single(),
      supabase
        .from('email_preferences')
        .select('message_notifications')
        .eq('user_id', recipientId)
        .single()
    ]);

    const { data: recipientProfile, error: recipientError } = recipientResult;
    const { data: emailPrefs } = emailPrefsResult;

    if (recipientError || !recipientProfile) {
      console.error('Error fetching recipient profile:', recipientError);
      return new Response(JSON.stringify({ error: 'Recipient not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If user has explicitly disabled message notifications, skip
    if (emailPrefs && emailPrefs.message_notifications === false) {
      console.log('User has disabled message notifications, skipping email');
      return new Response(JSON.stringify({ success: true, message: 'Notifications disabled' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!recipientProfile || !recipientProfile.email) {
      console.log('No recipient email found, skipping notification');
      return new Response(JSON.stringify({ success: true, message: 'No email to notify' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    
    const resend = new Resend(resendApiKey);

    console.log('Attempting to send email to:', recipientProfile.email);
    console.log('RESEND_API_KEY is set:', !!resendApiKey);
    console.log('RESEND_API_KEY format check:', resendApiKey.startsWith('re_') ? 'Valid format' : 'Invalid format - should start with re_');
    
    // Send email notification with better error handling
    console.log('Sending email with from address: info@thebazaarapp.com');
    const emailResult = await resend.emails.send({
      from: 'Bazaar <info@thebazaarapp.com>',
      to: [recipientProfile.email],
      subject: `New message from ${senderProfile.profile_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <img src="https://www.thebazaarapp.com/lovable-uploads/010f2159-7ae2-4e7e-a71a-681407407a54.png" 
                 alt="Bazaar Logo" 
                 style="height: 40px; width: auto; margin-bottom: 10px;">
            <h1 style="margin: 0; font-size: 24px;">New Message on Bazaar</h1>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; padding: 20px;">
            <p style="margin: 0 0 16px 0; font-size: 16px;">Hi ${recipientProfile.profile_name},</p>
            
            <p style="margin: 0 0 16px 0;">You have a new message from <strong>${senderProfile.profile_name}</strong>:</p>
            
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 16px 0;">
              <p style="margin: 0; font-style: italic; color: #475569;">"${message}"</p>
            </div>
            
            <p style="margin: 16px 0 0 0; text-align: center;">
              <a href="https://www.thebazaarapp.com/#/messages" 
                 style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Reply to Message
              </a>
            </p>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <div style="text-align: center;">
              <img src="https://www.thebazaarapp.com/lovable-uploads/010f2159-7ae2-4e7e-a71a-681407407a54.png" 
                   alt="Bazaar Logo" 
                   style="height: 24px; width: auto; margin-bottom: 8px;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                This email was sent because you have an active conversation on Bazaar. 
                You can manage your notification preferences in your account settings.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (emailResult.error) {
      console.error('Resend API error details:', JSON.stringify(emailResult.error, null, 2));
      
      // If domain verification is the issue, try with onboarding@resend.dev
      if (emailResult.error.message?.includes('domain') || emailResult.error.message?.includes('verified')) {
        console.log('Retrying with Resend default domain...');
        const retryResult = await resend.emails.send({
          from: 'Bazaar <onboarding@resend.dev>',
          to: [recipientProfile.email],
          subject: `New message from ${senderProfile.profile_name}`,
          html: emailResult.html || 'You have a new message on Bazaar.',
        });
        
        if (retryResult.error) {
          console.error('Retry also failed:', retryResult.error);
          throw new Error(`Resend API error: ${retryResult.error.message}`);
        }
        
        console.log('Email sent successfully via retry:', retryResult);
        return new Response(JSON.stringify({ 
          success: true, 
          emailId: retryResult.data?.id,
          recipient: recipientProfile.email,
          method: 'retry'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Resend API error: ${emailResult.error.message}`);
    }
    
    console.log('Email sent successfully:', emailResult);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResult.data?.id,
      recipient: recipientProfile.email 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-message-notification function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});