-- ============================================
-- CHECK IF USERS WERE CREATED IN AUTH.USERS
-- ============================================
-- This checks if users exist in auth.users but not in staff table

-- Check all users in auth.users
SELECT 
  '=== ALL AUTH USERS ===' as section,
  email,
  created_at,
  email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users
ORDER BY created_at DESC;

-- Check all users in staff table
SELECT 
  '=== ALL STAFF USERS ===' as section,
  email,
  role,
  full_name,
  is_active,
  profile_completed
FROM public.staff
ORDER BY email;

-- Find users in auth.users but NOT in staff
SELECT 
  '=== USERS IN AUTH BUT NOT IN STAFF ===' as section,
  u.email,
  u.id,
  'Missing staff profile!' as issue
FROM auth.users u
LEFT JOIN public.staff s ON u.id = s.id
WHERE s.id IS NULL
ORDER BY u.email;

-- Count comparison
SELECT 
  '=== COUNT COMPARISON ===' as section,
  (SELECT COUNT(*) FROM auth.users) as auth_user_count,
  (SELECT COUNT(*) FROM public.staff) as staff_user_count,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.staff) 
    THEN '✅ Counts match'
    ELSE '❌ Counts mismatch - some users missing staff profiles!'
  END as status;

