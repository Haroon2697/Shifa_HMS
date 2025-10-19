-- Create missing staff profiles for users who don't have them
-- This fixes the "Database error querying schema" issue

-- First, let's see which users are missing profiles
SELECT 
  u.id,
  u.email,
  u.created_at,
  '❌ Missing profile' as status
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.staff s WHERE s.id = u.id
)
ORDER BY u.created_at;

-- Now create staff profiles for all users missing them
INSERT INTO public.staff (
  id,
  email,
  full_name,
  role,
  department,
  phone,
  specialization,
  license_number,
  is_active,
  profile_completed
)
SELECT 
  u.id,
  u.email,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    split_part(u.email, '@', 1),
    'User'
  ) as full_name,
  COALESCE(
    u.raw_user_meta_data->>'role',
    CASE 
      WHEN u.email LIKE '%admin%' THEN 'admin'
      WHEN u.email LIKE '%doctor%' THEN 'doctor'
      WHEN u.email LIKE '%receptionist%' THEN 'receptionist'
      WHEN u.email LIKE '%accountant%' THEN 'accountant'
      ELSE 'receptionist'
    END
  ) as role,
  COALESCE(
    u.raw_user_meta_data->>'department',
    'General'
  ) as department,
  u.raw_user_meta_data->>'phone' as phone,
  u.raw_user_meta_data->>'specialization' as specialization,
  u.raw_user_meta_data->>'license_number' as license_number,
  true as is_active,
  true as profile_completed
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.staff s WHERE s.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Verify all users now have profiles
SELECT 
  'Users without staff profiles (should be 0)' as description,
  COUNT(*) as count
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.staff s WHERE s.id = u.id
);

-- Show all staff profiles
SELECT 
  email,
  full_name,
  role,
  department,
  is_active,
  profile_completed,
  '✅ Ready to login' as status
FROM public.staff
ORDER BY created_at;
