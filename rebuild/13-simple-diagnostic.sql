-- ============================================
-- STEP 13: SIMPLE DIAGNOSTIC (No array_agg)
-- ============================================
-- Purpose: Simple checks without complex queries that might fail
-- Run this in Supabase SQL Editor

-- 13.1: Check for triggers on auth.users
SELECT 
  '=== CHECK 1: Triggers on auth.users ===' as check_name,
  COUNT(*) as trigger_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ No triggers (GOOD)'
    ELSE '❌ Triggers exist (BAD - this causes 500 error)'
  END as status
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- 13.2: List any triggers on auth.users
SELECT 
  '=== Trigger Details ===' as section,
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- 13.3: Check for custom functions in public schema
SELECT 
  '=== CHECK 2: Custom Functions ===' as check_name,
  COUNT(*) as function_count
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%user%';

-- 13.4: List custom functions
SELECT 
  '=== Function Names ===' as section,
  routine_name
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%user%';

-- 13.5: Check our staff table
SELECT 
  '=== CHECK 3: Staff Table ===' as check_name,
  COUNT(*) as staff_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ Staff data exists'
    ELSE '❌ Staff data missing'
  END as status
FROM public.staff;

-- 13.6: Check auth users
SELECT 
  '=== CHECK 4: Auth Users ===' as check_name,
  COUNT(*) as user_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ Users exist'
    ELSE '❌ Users missing'
  END as status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

-- 13.7: Check for RLS on staff
SELECT 
  '=== CHECK 5: RLS on staff ===' as check_name,
  relrowsecurity as rls_enabled,
  CASE 
    WHEN relrowsecurity = true THEN '✅ RLS enabled'
    ELSE '❌ RLS disabled'
  END as status
FROM pg_class
WHERE relname = 'staff';

-- FINAL SUMMARY
SELECT '=== DIAGNOSTIC COMPLETE ===' as summary;
SELECT 'If triggers exist on auth.users above, that is the problem!' as note;
