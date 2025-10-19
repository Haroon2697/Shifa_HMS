-- ============================================
-- STEP 8: CREATE STAFF PROFILES
-- ============================================
-- Purpose: Create staff profiles in public.staff for each auth user
-- This links auth.users with public.staff using the same UUID
-- Run this in Supabase SQL Editor

-- Step 8.1: Create Admin Staff Profile
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the admin user ID from auth.users
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@hospital.com';
  
  IF admin_user_id IS NOT NULL THEN
    -- Insert staff profile (or update if exists)
    INSERT INTO public.staff (
      id,
      email,
      full_name,
      role,
      phone,
      department,
      is_active,
      profile_completed
    ) VALUES (
      admin_user_id,
      'admin@hospital.com',
      'System Administrator',
      'admin',
      '+1-555-0100',
      'Administration',
      true,
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      phone = EXCLUDED.phone,
      department = EXCLUDED.department,
      is_active = EXCLUDED.is_active,
      profile_completed = EXCLUDED.profile_completed,
      updated_at = now();
    
    RAISE NOTICE '✅ Admin staff profile created/updated: %', admin_user_id;
  ELSE
    RAISE NOTICE '❌ Admin user not found in auth.users';
  END IF;
END $$;

SELECT '✅ Step 8.1: Admin staff profile created' as status;

-- Step 8.2: Create Doctor Staff Profile
DO $$
DECLARE
  doctor_user_id UUID;
BEGIN
  SELECT id INTO doctor_user_id FROM auth.users WHERE email = 'doctor@hospital.com';
  
  IF doctor_user_id IS NOT NULL THEN
    INSERT INTO public.staff (
      id,
      email,
      full_name,
      role,
      phone,
      department,
      specialization,
      license_number,
      is_active,
      profile_completed
    ) VALUES (
      doctor_user_id,
      'doctor@hospital.com',
      'Dr. Sarah Johnson',
      'doctor',
      '+1-555-0101',
      'Cardiology',
      'Cardiologist',
      'MD-12345',
      true,
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      phone = EXCLUDED.phone,
      department = EXCLUDED.department,
      specialization = EXCLUDED.specialization,
      license_number = EXCLUDED.license_number,
      is_active = EXCLUDED.is_active,
      profile_completed = EXCLUDED.profile_completed,
      updated_at = now();
    
    RAISE NOTICE '✅ Doctor staff profile created/updated: %', doctor_user_id;
  ELSE
    RAISE NOTICE '❌ Doctor user not found in auth.users';
  END IF;
END $$;

SELECT '✅ Step 8.2: Doctor staff profile created' as status;

-- Step 8.3: Create Receptionist Staff Profile
DO $$
DECLARE
  receptionist_user_id UUID;
BEGIN
  SELECT id INTO receptionist_user_id FROM auth.users WHERE email = 'receptionist@hospital.com';
  
  IF receptionist_user_id IS NOT NULL THEN
    INSERT INTO public.staff (
      id,
      email,
      full_name,
      role,
      phone,
      department,
      is_active,
      profile_completed
    ) VALUES (
      receptionist_user_id,
      'receptionist@hospital.com',
      'Jane Smith',
      'receptionist',
      '+1-555-0102',
      'Front Desk',
      true,
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      phone = EXCLUDED.phone,
      department = EXCLUDED.department,
      is_active = EXCLUDED.is_active,
      profile_completed = EXCLUDED.profile_completed,
      updated_at = now();
    
    RAISE NOTICE '✅ Receptionist staff profile created/updated: %', receptionist_user_id;
  ELSE
    RAISE NOTICE '❌ Receptionist user not found in auth.users';
  END IF;
END $$;

SELECT '✅ Step 8.3: Receptionist staff profile created' as status;

-- Verification: Show all staff profiles with matching auth users
SELECT 
  '=== VERIFICATION: STAFF PROFILES ===' as section,
  s.id,
  s.email,
  s.full_name,
  s.role,
  s.department,
  s.is_active,
  s.profile_completed,
  CASE 
    WHEN u.id IS NOT NULL THEN '✅ Auth user exists'
    ELSE '❌ No auth user'
  END as auth_status,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmed'
    ELSE '❌ Email not confirmed'
  END as email_status
FROM public.staff s
LEFT JOIN auth.users u ON s.id = u.id
ORDER BY s.email;

-- Count check
SELECT 
  '=== COUNT CHECK ===' as section,
  COUNT(*) as staff_profiles_created,
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ All 3 staff profiles created'
    ELSE '❌ Missing staff profiles'
  END as status
FROM public.staff
WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com');

-- Match check (auth users vs staff profiles)
SELECT 
  '=== MATCH CHECK ===' as section,
  (SELECT COUNT(*) FROM auth.users WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')) as auth_users,
  (SELECT COUNT(*) FROM public.staff WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')) as staff_profiles,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com')) = 
         (SELECT COUNT(*) FROM public.staff WHERE email IN ('admin@hospital.com', 'doctor@hospital.com', 'receptionist@hospital.com'))
    THEN '✅ Auth users and staff profiles match perfectly!'
    ELSE '❌ Mismatch between auth users and staff profiles'
  END as match_status;

-- Final status
SELECT '🎉 ALL STAFF PROFILES CREATED!' as final_status;
SELECT '✅ Next: Run rebuild/09-test-login.sql to test authentication' as next_step;
