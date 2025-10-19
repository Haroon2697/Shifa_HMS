-- ============================================
-- STEP 1: BACKUP CURRENT DATA
-- ============================================
-- Purpose: Save existing user information before reset
-- Run this in Supabase SQL Editor

-- Backup: Show all current staff profiles
SELECT 
  '=== STAFF PROFILES BACKUP ===' as section,
  id,
  email,
  full_name,
  role,
  department,
  phone,
  is_active,
  profile_completed,
  created_at
FROM public.staff
ORDER BY created_at;

-- Backup: Show all auth users
SELECT 
  '=== AUTH USERS BACKUP ===' as section,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at;

-- Count totals
SELECT 
  '=== TOTALS ===' as section,
  (SELECT COUNT(*) FROM public.staff) as total_staff,
  (SELECT COUNT(*) FROM auth.users) as total_auth_users,
  (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL) as confirmed_users;

-- Instructions
SELECT '✅ Backup complete! Copy the results above and save them.' as instruction;
SELECT '⚠️ Next: Run rebuild/02-complete-reset.sql to wipe database' as next_step;
