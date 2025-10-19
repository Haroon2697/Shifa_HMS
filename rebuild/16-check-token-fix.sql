-- ============================================
-- STEP 16: VERIFY TOKEN FIX WORKED
-- ============================================
-- Purpose: Check if the token fix actually worked
-- Run this in Supabase SQL Editor

-- Check all token columns for our test users
SELECT 
  '=== TOKEN STATUS ===' as section,
  email,
  CASE 
    WHEN confirmation_token IS NULL THEN '❌ NULL'
    WHEN confirmation_token = '' THEN '✅ Empty'
    ELSE '✅ Has value: ' || LEFT(confirmation_token, 20)
  END as confirmation_token_status,
  CASE 
    WHEN recovery_token IS NULL THEN '❌ NULL'
    WHEN recovery_token = '' THEN '✅ Empty'
    ELSE '✅ Has value'
  END as recovery_token_status,
  CASE 
    WHEN email_change_token_new IS NULL THEN '❌ NULL'
    WHEN email_change_token_new = '' THEN '✅ Empty'
    ELSE '✅ Has value'
  END as email_change_token_new_status,
  CASE 
    WHEN email_change_token_current IS NULL THEN '❌ NULL'
    WHEN email_change_token_current = '' THEN '✅ Empty'
    ELSE '✅ Has value'
  END as email_change_token_current_status,
  CASE 
    WHEN phone_change_token IS NULL THEN '❌ NULL'
    WHEN phone_change_token = '' THEN '✅ Empty'
    ELSE '✅ Has value'
  END as phone_change_token_status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
ORDER BY email;

-- Check if email is confirmed
SELECT 
  '=== EMAIL CONFIRMATION ===' as section,
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmed'
    ELSE '❌ Not confirmed'
  END as status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
ORDER BY email;
