-- ============================================
-- STEP 18: DELETE INVALID USERS
-- ============================================
-- Purpose: Delete users with incorrect passwords so we can recreate them properly
-- We'll recreate them using Supabase Admin API after this
-- Run this in Supabase SQL Editor

-- 18.1: First, delete staff profiles
DELETE FROM public.staff
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

SELECT '✅ Step 18.1: Deleted staff profiles' as status;

-- 18.2: Delete auth users (this requires a function with proper permissions)
CREATE OR REPLACE FUNCTION delete_test_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users
  WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');
  
  RAISE NOTICE '✅ Deleted test users from auth.users';
END;
$$;

SELECT delete_test_users();

SELECT '✅ Step 18.2: Deleted auth users' as status;

-- 18.3: Clean up the function
DROP FUNCTION IF EXISTS delete_test_users();

SELECT '✅ Step 18.3: Cleaned up' as status;

-- 18.4: Verify deletion
SELECT 
  '=== VERIFICATION: Users After Deletion ===' as section,
  COUNT(*) as remaining_users,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ All test users deleted - ready for recreation'
    ELSE '❌ Some users still exist'
  END as status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

SELECT '🎉 USERS DELETED!' as final_status;
SELECT '✅ Next: We will use Supabase Admin API to create users properly' as next_step;
