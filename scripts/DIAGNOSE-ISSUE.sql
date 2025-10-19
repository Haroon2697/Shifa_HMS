-- Diagnostic script to find the root cause of the database error

-- Check if staff table exists
SELECT 
  'staff table' as object,
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'staff'
  ) THEN '✅ Exists' ELSE '❌ Missing' END as status;

-- Check for any triggers on auth.users
SELECT 
  trigger_name,
  event_object_table,
  action_statement,
  '⚠️ May cause issues' as warning
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';

-- Check for functions that might be problematic
SELECT 
  routine_name,
  routine_type,
  routine_schema,
  '⚠️ Check this' as note
FROM information_schema.routines
WHERE routine_name LIKE '%user%'
  AND routine_schema = 'public';

-- Check staff table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'staff'
ORDER BY ordinal_position;

-- Check RLS policies on staff table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'staff';

-- Check if there are any users in auth.users
SELECT 
  'Total users in auth.users' as description,
  COUNT(*) as count
FROM auth.users;

-- Check if there are any staff profiles
SELECT 
  'Total staff profiles' as description,
  COUNT(*) as count
FROM public.staff;

-- Check for orphaned auth users (users without staff profiles)
SELECT 
  'Users without staff profiles' as description,
  COUNT(*) as count
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.staff s WHERE s.id = u.id
);
