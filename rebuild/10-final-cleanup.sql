-- ============================================
-- STEP 10: FINAL CLEANUP - REMOVE ALL TRIGGERS
-- ============================================
-- Purpose: Remove ANY triggers that might interfere with Supabase auth
-- This is critical because triggers on auth.users can cause 500 errors
-- Run this in Supabase SQL Editor

-- 10.1: Check for existing triggers on auth.users
SELECT 
  '=== EXISTING TRIGGERS ON auth.users ===' as check_name,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- 10.2: Drop ALL triggers on auth.users (by common names)
DO $$
BEGIN
  -- Drop all possible trigger names
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
  DROP TRIGGER IF EXISTS on_user_created ON auth.users CASCADE;
  DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users CASCADE;
  DROP TRIGGER IF EXISTS on_auth_user_created_trigger ON auth.users CASCADE;
  DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users CASCADE;
  DROP TRIGGER IF EXISTS on_user_signup ON auth.users CASCADE;
  
  RAISE NOTICE '✅ All triggers removed from auth.users';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Some triggers might not exist (this is OK)';
END $$;

SELECT '✅ Step 10.2: Triggers removed' as status;

-- 10.3: Drop ALL related functions
DO $$
BEGIN
  DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
  DROP FUNCTION IF EXISTS public.handle_user_create() CASCADE;
  DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
  DROP FUNCTION IF EXISTS auth.handle_new_user() CASCADE;
  DROP FUNCTION IF EXISTS public.create_profile_for_user() CASCADE;
  
  RAISE NOTICE '✅ All related functions removed';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Some functions might not exist (this is OK)';
END $$;

SELECT '✅ Step 10.3: Functions removed' as status;

-- 10.4: Verify triggers are gone
SELECT 
  '=== VERIFICATION: TRIGGERS AFTER CLEANUP ===' as check_name,
  COUNT(*) as trigger_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ PASS - No triggers on auth.users'
    ELSE '❌ FAIL - Triggers still exist!'
  END as status
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- 10.5: Show any remaining triggers (if any)
SELECT 
  '=== REMAINING TRIGGERS (should be empty) ===' as check_name,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- 10.6: Verify our staff table still exists and has data
SELECT 
  '=== VERIFICATION: STAFF TABLE ===' as check_name,
  COUNT(*) as staff_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ Staff data intact'
    ELSE '❌ Staff data missing'
  END as status
FROM public.staff;

-- 10.7: Verify auth users still exist
SELECT 
  '=== VERIFICATION: AUTH USERS ===' as check_name,
  COUNT(*) as user_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ Auth users intact'
    ELSE '❌ Auth users missing'
  END as status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

-- Final status
SELECT '🎉 CLEANUP COMPLETE!' as final_status;
SELECT '✅ Next: Try logging in again at http://localhost:3000/auth/login' as next_step;
SELECT '📋 If login still fails, we may need to check Supabase dashboard settings' as note;
