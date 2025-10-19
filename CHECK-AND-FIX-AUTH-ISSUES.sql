-- ============================================
-- CHECK AND FIX AUTH ISSUES
-- ============================================
-- Run this in Supabase SQL Editor to diagnose
-- why user creation is failing with 500 error
-- ============================================

-- PART 1: Check for triggers on auth.users
-- ============================================
SELECT '=== PART 1: CHECKING TRIGGERS ===' as section;

SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  proname as function_name,
  'DROP TRIGGER IF EXISTS ' || tgname || ' ON ' || tgrelid::regclass || ';' as drop_command
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'auth.users'::regclass
  AND tgname NOT LIKE 'pg_%'
  AND tgname NOT LIKE 'RI_%';

-- PART 2: Check for functions that might interfere
-- ============================================
SELECT '=== PART 2: CHECKING FUNCTIONS ===' as section;

SELECT 
  proname as function_name,
  pronamespace::regnamespace as schema_name,
  'DROP FUNCTION IF EXISTS ' || pronamespace::regnamespace || '.' || proname || ' CASCADE;' as drop_command
FROM pg_proc
WHERE (proname LIKE '%handle%user%' OR proname LIKE '%new_user%')
  AND pronamespace IN ('public'::regnamespace, 'auth'::regnamespace);

-- PART 3: Check auth.users table structure
-- ============================================
SELECT '=== PART 3: AUTH.USERS STRUCTURE ===' as section;

SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- PART 4: Try to manually create a test user in auth.users
-- ============================================
SELECT '=== PART 4: TESTING DIRECT INSERT ===' as section;

-- Clean up any previous test
DELETE FROM auth.users WHERE email = 'test-user-direct@test.com';

-- Try direct insert (this will show us the exact error)
DO $$
BEGIN
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    aud,
    role,
    instance_id,
    confirmation_token,
    recovery_token,
    email_change_token_current,
    email_change,
    phone,
    phone_confirmed_at,
    phone_change,
    phone_change_token,
    email_change_token_new,
    email_change_confirm_status,
    banned_until,
    reauthentication_token,
    reauthentication_sent_at,
    is_sso_user,
    deleted_at
  ) VALUES (
    gen_random_uuid(),
    'test-user-direct@test.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Test User"}'::jsonb,
    now(),
    now(),
    'authenticated',
    'authenticated',
    '00000000-0000-0000-0000-000000000000',
    '',
    '',
    '',
    '',
    NULL,
    NULL,
    '',
    '',
    '',
    0,
    NULL,
    '',
    NULL,
    false,
    NULL
  );
  
  RAISE NOTICE '✅ Direct insert succeeded!';
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Direct insert failed: %', SQLERRM;
END $$;

-- Clean up test user
DELETE FROM auth.users WHERE email = 'test-user-direct@test.com';

-- PART 5: Check RLS on auth.users
-- ============================================
SELECT '=== PART 5: CHECKING RLS ON AUTH.USERS ===' as section;

SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'auth'
  AND tablename = 'users';

-- PART 6: Recommended fixes
-- ============================================
SELECT '=== PART 6: RECOMMENDED FIXES ===' as section;

-- Drop any triggers found (you'll need to run these manually based on Part 1 results)
-- Example: DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop any interfering functions (you'll need to run these manually based on Part 2 results)
-- Example: DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

SELECT '✅ Diagnostic complete. Review results above.' as status;
SELECT 'If you see any triggers or functions, drop them as shown.' as next_action;

