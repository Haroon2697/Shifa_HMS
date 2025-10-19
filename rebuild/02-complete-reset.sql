-- ============================================
-- STEP 2: COMPLETE DATABASE RESET
-- ============================================
-- Purpose: Remove ALL problematic triggers, functions, and tables
-- ⚠️ WARNING: This will delete the staff table completely
-- Run this in Supabase SQL Editor

-- Step 2.1: Remove ALL triggers on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created_trigger ON auth.users CASCADE;

SELECT '✅ Step 2.1: All triggers removed' as status;

-- Step 2.2: Remove ALL custom functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_create() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS auth.handle_new_user() CASCADE;

SELECT '✅ Step 2.2: All functions removed' as status;

-- Step 2.3: Drop staff table completely
DROP TABLE IF EXISTS public.staff CASCADE;

SELECT '✅ Step 2.3: Staff table dropped' as status;

-- Step 2.4: Verification - Check for remaining triggers
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ No triggers remain - GOOD!'
    ELSE '❌ WARNING: Triggers still exist!'
  END as trigger_check,
  COUNT(*) as trigger_count
FROM information_schema.triggers
WHERE event_object_table = 'users' AND trigger_schema = 'auth';

-- Step 2.5: Verification - Check for remaining functions
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ No custom functions remain - GOOD!'
    ELSE '⚠️ Some functions still exist (may be OK)'
  END as function_check,
  COUNT(*) as function_count
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name LIKE '%user%';

-- Step 2.6: Verification - Check staff table is gone
SELECT 
  CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = 'staff'
    ) THEN '✅ Staff table removed - GOOD!'
    ELSE '❌ WARNING: Staff table still exists!'
  END as table_check;

-- Final status
SELECT '🎉 DATABASE RESET COMPLETE!' as final_status;
SELECT '✅ Ready for Step 3: Verify Clean State' as next_step;
