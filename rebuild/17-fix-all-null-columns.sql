-- ============================================
-- STEP 17: FIX ALL NULL STRING COLUMNS
-- ============================================
-- Purpose: Fix ALL NULL string columns in auth.users that cause scan errors
-- Run this in Supabase SQL Editor

-- Create a comprehensive fix function with all possible NULL string columns
CREATE OR REPLACE FUNCTION fix_all_user_null_columns()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update ALL NULL string columns to empty strings
  UPDATE auth.users
  SET 
    -- Token columns
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    reauthentication_token = COALESCE(reauthentication_token, ''),
    
    -- Email/Phone change columns
    email_change = COALESCE(email_change, ''),
    phone_change = COALESCE(phone_change, '')
    
  WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');
  
  RAISE NOTICE '✅ All NULL columns fixed for test users';
END;
$$;

SELECT '✅ Created fix function' as status;

-- Execute the function
SELECT fix_all_user_null_columns();

SELECT '✅ Executed comprehensive fix' as status;

-- Verify ALL columns are fixed
SELECT 
  '=== VERIFICATION: ALL STRING COLUMNS ===' as section,
  email,
  CASE WHEN confirmation_token IS NULL THEN '❌' ELSE '✅' END || ' confirmation_token',
  CASE WHEN recovery_token IS NULL THEN '❌' ELSE '✅' END || ' recovery_token',
  CASE WHEN email_change_token_new IS NULL THEN '❌' ELSE '✅' END || ' email_change_token_new',
  CASE WHEN email_change_token_current IS NULL THEN '❌' ELSE '✅' END || ' email_change_token_current',
  CASE WHEN phone_change_token IS NULL THEN '❌' ELSE '✅' END || ' phone_change_token',
  CASE WHEN reauthentication_token IS NULL THEN '❌' ELSE '✅' END || ' reauthentication_token',
  CASE WHEN email_change IS NULL THEN '❌' ELSE '✅' END || ' email_change',
  CASE WHEN phone_change IS NULL THEN '❌' ELSE '✅' END || ' phone_change'
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
ORDER BY email;

-- Clean up
DROP FUNCTION IF EXISTS fix_all_user_null_columns();

SELECT '✅ Cleaned up function' as status;

SELECT '🎉 ALL NULL COLUMNS FIXED!' as final_status;
SELECT '✅ Try logging in now: http://localhost:3000/auth/login' as next_step;
SELECT '📧 Credentials: admin@hospital.com / password123' as credentials;
