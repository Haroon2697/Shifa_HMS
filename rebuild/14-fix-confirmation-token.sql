-- ============================================
-- STEP 14: FIX confirmation_token NULL ISSUE
-- ============================================
-- Purpose: Fix the "converting NULL to string is unsupported" error
-- The issue is that auth.users.confirmation_token column has NULL values
-- but Supabase Auth expects it to be an empty string
-- Run this in Supabase SQL Editor

-- 14.1: Check current confirmation_token values
SELECT 
  '=== CHECK: confirmation_token values ===' as section,
  email,
  confirmation_token,
  CASE 
    WHEN confirmation_token IS NULL THEN '❌ NULL (causes error)'
    WHEN confirmation_token = '' THEN '✅ Empty string (good)'
    ELSE '✅ Has value (good)'
  END as status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

-- 14.2: Update NULL confirmation_token to empty string
UPDATE auth.users
SET 
  confirmation_token = '',
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  phone_change_token = COALESCE(phone_change_token, '')
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

SELECT '✅ Step 14.2: Updated NULL tokens to empty strings' as status;

-- 14.3: Verify the fix
SELECT 
  '=== VERIFICATION: After fix ===' as section,
  email,
  confirmation_token,
  CASE 
    WHEN confirmation_token IS NULL THEN '❌ Still NULL'
    WHEN confirmation_token = '' THEN '✅ Empty string (fixed!)'
    ELSE '✅ Has value'
  END as status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

-- 14.4: Set default for future users (optional but recommended)
-- This ensures all new users don't have this problem
ALTER TABLE auth.users
ALTER COLUMN confirmation_token SET DEFAULT '';

ALTER TABLE auth.users
ALTER COLUMN recovery_token SET DEFAULT '';

ALTER TABLE auth.users
ALTER COLUMN email_change_token_new SET DEFAULT '';

ALTER TABLE auth.users
ALTER COLUMN email_change_token_current SET DEFAULT '';

ALTER TABLE auth.users
ALTER COLUMN phone_change_token SET DEFAULT '';

SELECT '✅ Step 14.4: Set default empty strings for token columns' as status;

-- Final check
SELECT 
  '=== FINAL STATUS ===' as section,
  COUNT(*) as user_count,
  CASE 
    WHEN COUNT(*) FILTER (WHERE confirmation_token IS NULL) = 0 
    THEN '✅ All users have valid confirmation_token'
    ELSE '❌ Some users still have NULL confirmation_token'
  END as status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

SELECT '🎉 CONFIRMATION TOKEN ISSUE FIXED!' as final_status;
SELECT '✅ Next: Try logging in again at http://localhost:3000/auth/login' as next_step;
