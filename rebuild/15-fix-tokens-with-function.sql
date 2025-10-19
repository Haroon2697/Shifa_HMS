-- ============================================
-- STEP 15: FIX TOKENS USING PRIVILEGED FUNCTION
-- ============================================
-- Purpose: Fix NULL token values using a security definer function
-- This bypasses permission issues by running with elevated privileges
-- Run this in Supabase SQL Editor

-- 15.1: Create a privileged function to update tokens
CREATE OR REPLACE FUNCTION fix_user_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- This makes it run with the function owner's privileges
AS $$
BEGIN
  -- Update NULL tokens to empty strings for our test users
  UPDATE auth.users
  SET 
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone_change_token = COALESCE(phone_change_token, '')
  WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
    AND (
      confirmation_token IS NULL 
      OR recovery_token IS NULL 
      OR email_change_token_new IS NULL 
      OR email_change_token_current IS NULL 
      OR phone_change_token IS NULL
    );
  
  RAISE NOTICE 'Tokens updated successfully';
END;
$$;

SELECT '✅ Step 15.1: Created fix_user_tokens function' as status;

-- 15.2: Execute the function
SELECT fix_user_tokens();

SELECT '✅ Step 15.2: Executed token fix' as status;

-- 15.3: Verify the fix
SELECT 
  '=== VERIFICATION ===' as section,
  email,
  CASE 
    WHEN confirmation_token IS NULL THEN '❌ confirmation_token is NULL'
    WHEN confirmation_token = '' THEN '✅ confirmation_token is empty string'
    ELSE '✅ confirmation_token has value'
  END as confirmation_status,
  CASE 
    WHEN recovery_token IS NULL THEN '❌ recovery_token is NULL'
    WHEN recovery_token = '' THEN '✅ recovery_token is empty string'
    ELSE '✅ recovery_token has value'
  END as recovery_status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
ORDER BY email;

-- 15.4: Clean up the function
DROP FUNCTION IF EXISTS fix_user_tokens();

SELECT '✅ Step 15.4: Cleaned up temporary function' as status;

SELECT '🎉 TOKEN FIX COMPLETE!' as final_status;
SELECT '✅ Next: Try logging in at http://localhost:3000/auth/login' as next_step;
SELECT '📧 Use: admin@hospital.com / password123' as credentials;
