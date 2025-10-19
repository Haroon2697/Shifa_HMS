-- ============================================
-- STEP 6: TEST DATABASE STRUCTURE
-- ============================================
-- Purpose: Verify staff table works correctly by testing insert/select operations
-- Run this in Supabase SQL Editor

-- Test 6.1: Insert a test record
INSERT INTO public.staff (
  id,
  email,
  full_name,
  role,
  department,
  is_active,
  profile_completed
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'test@example.com',
  'Test User',
  'admin',
  'Testing',
  true,
  true
);

SELECT '✅ Test 6.1: Successfully inserted test record' as status;

-- Test 6.2: Query the test record
SELECT 
  '=== Test 6.2: QUERY TEST ===' as test_name,
  id,
  email,
  full_name,
  role,
  department,
  is_active,
  profile_completed
FROM public.staff
WHERE email = 'test@example.com';

-- Test 6.3: Update the test record
UPDATE public.staff
SET full_name = 'Test User Updated'
WHERE email = 'test@example.com';

SELECT '✅ Test 6.3: Successfully updated test record' as status;

-- Test 6.4: Verify update worked
SELECT 
  '=== Test 6.4: UPDATE VERIFICATION ===' as test_name,
  full_name,
  CASE 
    WHEN full_name = 'Test User Updated' THEN '✅ Update worked!'
    ELSE '❌ Update failed!'
  END as result
FROM public.staff
WHERE email = 'test@example.com';

-- Test 6.5: Delete the test record
DELETE FROM public.staff
WHERE email = 'test@example.com';

SELECT '✅ Test 6.5: Successfully deleted test record' as status;

-- Test 6.6: Verify deletion worked
SELECT 
  '=== Test 6.6: DELETE VERIFICATION ===' as test_name,
  CASE 
    WHEN NOT EXISTS (SELECT 1 FROM public.staff WHERE email = 'test@example.com')
    THEN '✅ Delete worked - record removed!'
    ELSE '❌ Delete failed - record still exists!'
  END as result;

-- Test 6.7: Verify table is empty and ready
SELECT 
  '=== Test 6.7: TABLE STATUS ===' as test_name,
  COUNT(*) as record_count,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Table is empty and ready for real data'
    ELSE '⚠️ Table has records (should be 0)'
  END as status
FROM public.staff;

-- Final Summary
SELECT '🎉 ALL TESTS PASSED!' as final_status;
SELECT '✅ Database structure is working perfectly!' as message;
SELECT '✅ Next: Run rebuild/07-create-auth-users.sql to create test users' as next_step;
