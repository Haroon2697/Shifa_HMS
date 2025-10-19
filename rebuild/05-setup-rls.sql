-- ============================================
-- STEP 5: SETUP ROW LEVEL SECURITY (RLS)
-- ============================================
-- Purpose: Configure secure but permissive access policies
-- Run this in Supabase SQL Editor

-- Step 5.1: Enable RLS on staff table
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

SELECT '✅ Step 5.1: RLS enabled on staff table' as status;

-- Step 5.2: Drop any existing policies (in case of retry)
DROP POLICY IF EXISTS "allow_authenticated_all" ON public.staff;
DROP POLICY IF EXISTS "allow_service_role_all" ON public.staff;

SELECT '✅ Step 5.2: Cleared any existing policies' as status;

-- Step 5.3: Create permissive policy for authenticated users
-- This allows all authenticated users to read, insert, update, and delete
CREATE POLICY "allow_authenticated_all"
  ON public.staff
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

SELECT '✅ Step 5.3: Created policy for authenticated users' as status;

-- Step 5.4: Create policy for service role (for system operations)
CREATE POLICY "allow_service_role_all"
  ON public.staff
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

SELECT '✅ Step 5.4: Created policy for service role' as status;

-- Step 5.5: Grant necessary permissions
GRANT ALL ON public.staff TO postgres, service_role;
GRANT ALL ON public.staff TO authenticated;
GRANT USAGE ON SCHEMA public TO postgres, authenticated, service_role, anon;

SELECT '✅ Step 5.5: Permissions granted' as status;

-- Verification: Check RLS is enabled
SELECT 
  '=== VERIFICATION: RLS STATUS ===' as check_name,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS is enabled'
    ELSE '❌ RLS is NOT enabled'
  END as status
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'staff';

-- Verification: List all policies
SELECT 
  '=== VERIFICATION: POLICIES ===' as check_name,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'staff';

-- Verification: Check permissions
SELECT 
  '=== VERIFICATION: PERMISSIONS ===' as check_name,
  grantee,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' AND table_name = 'staff'
ORDER BY grantee, privilege_type;

-- Final status
SELECT '🎉 RLS CONFIGURED SUCCESSFULLY!' as final_status;
SELECT '✅ Next: Run rebuild/06-test-structure.sql to test the table' as next_step;
