-- ============================================
-- STEP 9: TEST DATABASE LOGIN
-- ============================================
-- Purpose: Verify that the database is correctly set up for authentication
-- This tests the database structure, not the actual Supabase auth API
-- Run this in Supabase SQL Editor

-- Test 9.1: Verify all test users exist in auth.users
SELECT 
  '=== Test 9.1: AUTH USERS ===' as test_name,
  COUNT(*) as user_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ PASS - All users exist'
    ELSE '❌ FAIL - Missing users'
  END as status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

-- Test 9.2: Verify all emails are confirmed
SELECT 
  '=== Test 9.2: EMAIL CONFIRMATION ===' as test_name,
  COUNT(*) as confirmed_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ PASS - All emails confirmed'
    ELSE '❌ FAIL - Some emails not confirmed'
  END as status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
  AND email_confirmed_at IS NOT NULL;

-- Test 9.3: Verify all staff profiles exist
SELECT 
  '=== Test 9.3: STAFF PROFILES ===' as test_name,
  COUNT(*) as profile_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ PASS - All profiles exist'
    ELSE '❌ FAIL - Missing profiles'
  END as status
FROM public.staff
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

-- Test 9.4: Verify all profiles are active
SELECT 
  '=== Test 9.4: ACTIVE PROFILES ===' as test_name,
  COUNT(*) as active_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ PASS - All profiles active'
    ELSE '❌ FAIL - Some profiles inactive'
  END as status
FROM public.staff
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
  AND is_active = true;

-- Test 9.5: Verify all profiles are completed
SELECT 
  '=== Test 9.5: COMPLETED PROFILES ===' as test_name,
  COUNT(*) as completed_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ PASS - All profiles completed'
    ELSE '❌ FAIL - Some profiles incomplete'
  END as status
FROM public.staff
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
  AND profile_completed = true;

-- Test 9.6: Verify UUIDs match between auth.users and staff
SELECT 
  '=== Test 9.6: UUID MATCHING ===' as test_name,
  COUNT(*) as matched_count,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ PASS - All UUIDs match'
    ELSE '❌ FAIL - UUID mismatch'
  END as status
FROM auth.users u
INNER JOIN public.staff s ON u.id = s.id
WHERE u.email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

-- Test 9.7: Verify roles are correctly set
SELECT 
  '=== Test 9.7: ROLE VERIFICATION ===' as test_name,
  s.email,
  s.role,
  CASE 
    WHEN s.email = 'admin@hospital.com' AND s.role = 'admin' THEN '✅ Correct'
    WHEN s.email = 'doctor@hospital.com' AND s.role = 'doctor' THEN '✅ Correct'
    WHEN s.email = 'receptionist@hospital.com' AND s.role = 'receptionist' THEN '✅ Correct'
    ELSE '❌ Wrong role'
  END as role_status
FROM public.staff s
WHERE s.email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
ORDER BY s.email;

-- Test 9.8: Simulate login query (what the app will do)
-- This checks if we can retrieve user info as the app would
SELECT 
  '=== Test 9.8: SIMULATED LOGIN QUERY ===' as test_name,
  u.id as user_id,
  u.email,
  s.full_name,
  s.role,
  s.department,
  s.is_active,
  s.profile_completed,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL 
         AND s.is_active = true 
         AND s.profile_completed = true 
    THEN '✅ Can login'
    ELSE '❌ Cannot login'
  END as login_status
FROM auth.users u
INNER JOIN public.staff s ON u.id = s.id
WHERE u.email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
ORDER BY u.email;

-- Test 9.9: Check RLS is enabled
SELECT 
  '=== Test 9.9: RLS STATUS ===' as test_name,
  relname as table_name,
  relrowsecurity as rls_enabled,
  CASE 
    WHEN relrowsecurity = true THEN '✅ PASS - RLS enabled'
    ELSE '❌ FAIL - RLS disabled'
  END as status
FROM pg_class
WHERE relname = 'staff';

-- Test 9.10: Check RLS policies exist
SELECT 
  '=== Test 9.10: RLS POLICIES ===' as test_name,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ PASS - Policies exist'
    ELSE '❌ FAIL - Missing policies'
  END as status
FROM pg_policies
WHERE tablename = 'staff';

-- FINAL SUMMARY
SELECT 
  '=== FINAL SUMMARY ===' as section,
  'Database Test Results' as description;

SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')) = 3
         AND (SELECT COUNT(*) FROM auth.users WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com') AND email_confirmed_at IS NOT NULL) = 3
         AND (SELECT COUNT(*) FROM public.staff WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')) = 3
         AND (SELECT COUNT(*) FROM public.staff WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com') AND is_active = true AND profile_completed = true) = 3
         AND (SELECT relrowsecurity FROM pg_class WHERE relname = 'staff') = true
    THEN '🎉 ALL DATABASE TESTS PASSED! Ready to test app login!'
    ELSE '❌ SOME TESTS FAILED - Review results above'
  END as final_status;

SELECT '✅ Next: Test login in the actual app at http://localhost:3000/auth/login' as next_step;
SELECT '📋 Login credentials:' as info;
SELECT '   • admin@hospital.com / password123' as credential_1;
SELECT '   • doctor@hospital.com / password123' as credential_2;
SELECT '   • receptionist@hospital.com / password123' as credential_3;
