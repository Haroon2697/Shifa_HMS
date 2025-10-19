-- ============================================
-- STEP 3: VERIFY CLEAN STATE
-- ============================================
-- Purpose: Confirm database is completely clean and ready for rebuild
-- Run this in Supabase SQL Editor

-- Check 1: Verify no triggers on auth.users
SELECT 
  '=== CHECK 1: TRIGGERS ===' as check_name,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ PASS - No triggers found'
    ELSE '❌ FAIL - Triggers still exist!'
  END as result,
  COUNT(*) as trigger_count
FROM information_schema.triggers
WHERE event_object_table = 'users' AND trigger_schema = 'auth';

-- Check 2: Verify no custom functions (that could cause issues)
SELECT 
  '=== CHECK 2: FUNCTIONS ===' as check_name,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ PASS - No problematic functions'
    ELSE '⚠️ WARNING - Some functions exist (check if related to staff)'
  END as result,
  COUNT(*) as function_count
FROM information_schema.routines
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%user%';

-- Check 3: Verify staff table is gone
SELECT 
  '=== CHECK 3: STAFF TABLE ===' as check_name,
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = 'staff'
    ) THEN '✅ PASS - Staff table removed'
    ELSE '❌ FAIL - Staff table still exists!'
  END as result;

-- Check 4: Verify auth.users table still exists (should not be deleted)
SELECT 
  '=== CHECK 4: AUTH USERS ===' as check_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'auth' AND tablename = 'users'
    ) THEN '✅ PASS - Auth users table exists'
    ELSE '❌ FAIL - Auth users table missing!'
  END as result,
  (SELECT COUNT(*) FROM auth.users) as user_count;

-- Check 5: List all public tables (should be empty or minimal)
SELECT 
  '=== CHECK 5: PUBLIC TABLES ===' as check_name,
  tablename,
  CASE 
    WHEN tablename = 'staff' THEN '❌ Should not exist'
    ELSE '✅ OK'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Final Summary
SELECT 
  '=== FINAL SUMMARY ===' as section,
  CASE 
    WHEN (SELECT COUNT(*) FROM information_schema.triggers 
          WHERE event_object_table = 'users' AND trigger_schema = 'auth') = 0
    AND NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'staff')
    AND EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'auth' AND tablename = 'users')
    THEN '✅ DATABASE IS CLEAN - Ready for rebuild!'
    ELSE '❌ ISSUES FOUND - Review checks above'
  END as status;

-- Next step instructions
SELECT '✅ If all checks pass, proceed to Step 4: Create Staff Table' as next_step;
