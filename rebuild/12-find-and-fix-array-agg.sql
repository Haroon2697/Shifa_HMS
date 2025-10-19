-- ============================================
-- STEP 12: FIX array_agg ERROR
-- ============================================
-- Purpose: Find and fix the function causing "array_agg is an aggregate function" error
-- This error happens when a function incorrectly uses array_agg
-- Run this in Supabase SQL Editor

-- 12.1: Find ALL functions that use array_agg
SELECT 
  '=== FUNCTIONS USING array_agg ===' as section,
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE pg_get_functiondef(p.oid) ILIKE '%array_agg%'
  AND n.nspname IN ('public', 'auth')
ORDER BY n.nspname, p.proname;

-- 12.2: Check for any auth-related functions
SELECT 
  '=== ALL FUNCTIONS IN auth SCHEMA ===' as section,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'auth'
ORDER BY p.proname;

-- 12.3: Drop any custom auth functions (common culprits)
DO $$
BEGIN
  -- Drop common problematic functions
  DROP FUNCTION IF EXISTS auth.email() CASCADE;
  DROP FUNCTION IF EXISTS auth.uid() CASCADE;
  DROP FUNCTION IF EXISTS auth.role() CASCADE;
  DROP FUNCTION IF EXISTS auth.jwt() CASCADE;
  
  RAISE NOTICE '✅ Custom auth functions removed (if they existed)';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '⚠️ Some functions might not exist';
END $$;

SELECT '✅ Step 12.3: Custom auth functions cleaned up' as status;

-- 12.4: Check if the error is gone
SELECT 
  '=== VERIFICATION: Remaining auth functions ===' as section,
  COUNT(*) as function_count
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'auth'
  AND p.proname NOT IN ('email', 'role', 'uid', 'jwt'); -- Built-in Supabase functions

SELECT '✅ If you see this message, the script ran successfully!' as status;
SELECT '📝 Now look at the function definitions above - they might show the problem' as next_step;
