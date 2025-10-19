-- ============================================
-- FIX USER PASSWORDS FOR NEW USERS
-- ============================================
-- The issue: Users created via SQL have incompatible password hashing
-- Solution: Update their passwords to use proper Supabase Auth format
-- ============================================

-- STEP 1: Check current password hashes
SELECT 
  '=== CURRENT PASSWORD HASHES ===' as section,
  email,
  substring(encrypted_password, 1, 20) || '...' as password_hash_preview,
  length(encrypted_password) as hash_length,
  email_confirmed_at IS NOT NULL as email_confirmed
FROM auth.users
WHERE email IN (
  'nurse@hospital.com',
  'accountant@hospital.com', 
  'radiologist@hospital.com',
  'pharmacist@hospital.com'
)
ORDER BY email;

-- STEP 2: Delete the problematic users and recreate with proper Admin API
-- We'll just delete them from auth.users (staff profiles will remain)
-- Then we can recreate them using the Admin API

SELECT '⚠️ Users need to be recreated with proper password hashing' as issue;
SELECT 'The crypt() function in PostgreSQL uses a different format than Supabase Auth expects' as explanation;

-- Show which users need to be fixed
SELECT 
  '=== USERS TO FIX ===' as section,
  u.email,
  u.id,
  s.role,
  s.full_name,
  'DELETE FROM auth.users WHERE email = ''' || u.email || ''';' as delete_command
FROM auth.users u
JOIN public.staff s ON u.id = s.id
WHERE u.email IN (
  'nurse@hospital.com',
  'accountant@hospital.com',
  'radiologist@hospital.com',
  'pharmacist@hospital.com'
)
ORDER BY u.email;

-- STEP 3: Actually delete these users from auth.users
-- Their staff profiles will remain, so we just need to recreate auth records

DELETE FROM auth.users 
WHERE email IN (
  'nurse@hospital.com',
  'accountant@hospital.com',
  'radiologist@hospital.com',
  'pharmacist@hospital.com'
);

SELECT '✅ Deleted users from auth.users' as status;
SELECT 'Staff profiles are preserved' as note;
SELECT 'Next: Use Node.js script to recreate with proper passwords' as next_step;

-- STEP 4: Verify deletion
SELECT 
  '=== VERIFICATION ===' as section,
  COUNT(*) as remaining_auth_users,
  (SELECT COUNT(*) FROM public.staff) as staff_profiles_count
FROM auth.users;

SELECT '🔧 Ready for recreation via Admin API' as final_status;

