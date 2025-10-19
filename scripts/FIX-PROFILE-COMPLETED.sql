-- Fix profile_completed flag for all active users
-- This allows all users to login successfully

UPDATE public.staff
SET profile_completed = true
WHERE is_active = true;

-- Show updated results
SELECT 
  email, 
  role, 
  department,
  profile_completed,
  CASE 
    WHEN profile_completed = true THEN '✅ Complete'
    ELSE '❌ Incomplete'
  END as status
FROM public.staff
ORDER BY created_at;
