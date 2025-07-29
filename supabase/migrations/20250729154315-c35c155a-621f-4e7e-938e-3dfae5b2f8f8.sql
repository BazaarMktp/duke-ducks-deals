-- Test UNC user for marketplace separation
-- Insert a test UNC profile to verify college-based marketplace separation
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    gen_random_uuid(),
    'test@unc.edu',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    '',
    ''
) ON CONFLICT (email) DO NOTHING;

-- Get the UNC college ID 
DO $$
DECLARE
    unc_college_id uuid;
    test_user_id uuid;
BEGIN
    -- Get UNC college ID
    SELECT id INTO unc_college_id FROM colleges WHERE domain = 'unc.edu';
    
    -- Get the test user ID
    SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@unc.edu';
    
    -- Insert profile for test UNC user
    INSERT INTO profiles (
        id,
        full_name,
        profile_name,
        email,
        is_verified,
        college_id
    ) VALUES (
        test_user_id,
        'Test UNC User',
        'test_unc',
        'test@unc.edu',
        true,
        unc_college_id
    ) ON CONFLICT (id) DO NOTHING;
    
    -- Add user role
    INSERT INTO user_roles (user_id, role) VALUES (test_user_id, 'user') ON CONFLICT DO NOTHING;
    
    -- Create a test listing for UNC marketplace
    INSERT INTO listings (
        user_id,
        title,
        description,
        price,
        category,
        listing_type,
        status,
        college_id
    ) VALUES (
        test_user_id,
        'UNC Test Laptop',
        'Test laptop for UNC marketplace',
        500.00,
        'marketplace',
        'offer',
        'active',
        unc_college_id
    ) ON CONFLICT DO NOTHING;
END $$;