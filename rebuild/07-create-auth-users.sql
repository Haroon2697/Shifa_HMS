-- ============================================
-- STEP 7: CREATE AUTH USERS IN SUPABASE
-- ============================================
-- Purpose: Add 3 test users to auth.users table ONLY (with confirmed emails)
-- We will create staff profiles separately in Step 8
-- Run this in Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 7.1: Create Admin User
DO $$
DECLARE
  admin_id UUID;
  existing_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id FROM auth.users WHERE email = 'admin@hospital.com';
  
  IF existing_user_id IS NULL THEN
    -- Generate a new UUID for admin
    admin_id := gen_random_uuid();
    
    -- Insert into auth.users with email already confirmed
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      raw_app_meta_data,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_id,
      'authenticated',
      'authenticated',
      'admin@hospital.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"full_name": "System Administrator"}',
      '{"provider": "email", "providers": ["email"]}',
      false
    );
    
    RAISE NOTICE '✅ Admin user created: %', admin_id;
  ELSE
    RAISE NOTICE '⚠️ Admin user already exists: %', existing_user_id;
  END IF;
END $$;

SELECT '✅ Step 7.1: Admin user created' as status;

-- Step 7.2: Create Doctor User
DO $$
DECLARE
  doctor_id UUID;
  existing_user_id UUID;
BEGIN
  SELECT id INTO existing_user_id FROM auth.users WHERE email = 'doctor@hospital.com';
  
  IF existing_user_id IS NULL THEN
    doctor_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      raw_app_meta_data,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      doctor_id,
      'authenticated',
      'authenticated',
      'doctor@hospital.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"full_name": "Dr. Sarah Johnson"}',
      '{"provider": "email", "providers": ["email"]}',
      false
    );
    
    RAISE NOTICE '✅ Doctor user created: %', doctor_id;
  ELSE
    RAISE NOTICE '⚠️ Doctor user already exists: %', existing_user_id;
  END IF;
END $$;

SELECT '✅ Step 7.2: Doctor user created' as status;

-- Step 7.3: Create Receptionist User
DO $$
DECLARE
  receptionist_id UUID;
  existing_user_id UUID;
BEGIN
  SELECT id INTO existing_user_id FROM auth.users WHERE email = 'receptionist@hospital.com';
  
  IF existing_user_id IS NULL THEN
    receptionist_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_user_meta_data,
      raw_app_meta_data,
      is_super_admin
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      receptionist_id,
      'authenticated',
      'authenticated',
      'receptionist@hospital.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"full_name": "Jane Smith"}',
      '{"provider": "email", "providers": ["email"]}',
      false
    );
    
    RAISE NOTICE '✅ Receptionist user created: %', receptionist_id;
  ELSE
    RAISE NOTICE '⚠️ Receptionist user already exists: %', existing_user_id;
  END IF;
END $$;

SELECT '✅ Step 7.3: Receptionist user created' as status;

-- Verification: Show all created users
SELECT 
  '=== VERIFICATION: AUTH USERS ===' as section,
  id,
  email,
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmed'
    ELSE '❌ Not confirmed'
  END as confirmation_status,
  created_at
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')
ORDER BY email;

-- Count check
SELECT 
  '=== COUNT CHECK ===' as section,
  COUNT(*) as users_created,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ All 3 users created'
    ELSE '❌ Missing users'
  END as status
FROM auth.users
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

-- Final status
SELECT '🎉 ALL AUTH USERS CREATED WITH CONFIRMED EMAILS!' as final_status;
SELECT '✅ Next: Run rebuild/08-create-staff-profiles.sql to create staff records' as next_step;
