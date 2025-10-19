-- ============================================
-- CREATE MISSING USERS DIRECTLY VIA SQL
-- ============================================
-- Since Admin API is failing with 500, let's try direct SQL
-- This bypasses any Admin API issues
-- ============================================

-- PART 1: Create User 1 - Nurse
-- ============================================
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Generate a new UUID
  v_user_id := gen_random_uuid();
  
  -- Check if user already exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'nurse@hospital.com') THEN
    RAISE NOTICE '⚠️ nurse@hospital.com already exists';
    RETURN;
  END IF;
  
  -- Insert into auth.users
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
    v_user_id,
    'nurse@hospital.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Jessica Martinez","role":"nurse"}'::jsonb,
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
  
  -- Insert into staff table
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
  ) VALUES (
    v_user_id,
    'nurse@hospital.com',
    'Jessica Martinez',
    'nurse',
    'General Ward',
    '+1-555-0104',
    'General Nursing',
    'RN-2024-001',
    true,
    true
  );
  
  RAISE NOTICE '✅ Created nurse@hospital.com';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Failed to create nurse@hospital.com: %', SQLERRM;
END $$;

-- PART 2: Create User 2 - Accountant
-- ============================================
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := gen_random_uuid();
  
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'accountant@hospital.com') THEN
    RAISE NOTICE '⚠️ accountant@hospital.com already exists';
    RETURN;
  END IF;
  
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    aud, role, instance_id, confirmation_token, recovery_token,
    email_change_token_current, email_change, phone, phone_confirmed_at,
    phone_change, phone_change_token, email_change_token_new,
    email_change_confirm_status, banned_until, reauthentication_token,
    reauthentication_sent_at, is_sso_user, deleted_at
  ) VALUES (
    v_user_id, 'accountant@hospital.com', crypt('password123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Michael Brown","role":"accountant"}'::jsonb,
    now(), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000',
    '', '', '', '', NULL, NULL, '', '', '', 0, NULL, '', NULL, false, NULL
  );
  
  INSERT INTO public.staff (
    id, email, full_name, role, department, phone, is_active, profile_completed
  ) VALUES (
    v_user_id, 'accountant@hospital.com', 'Michael Brown', 'accountant',
    'Finance', '+1-555-0105', true, true
  );
  
  RAISE NOTICE '✅ Created accountant@hospital.com';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Failed to create accountant@hospital.com: %', SQLERRM;
END $$;

-- PART 3: Create User 3 - Radiologist
-- ============================================
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := gen_random_uuid();
  
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'radiologist@hospital.com') THEN
    RAISE NOTICE '⚠️ radiologist@hospital.com already exists';
    RETURN;
  END IF;
  
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    aud, role, instance_id, confirmation_token, recovery_token,
    email_change_token_current, email_change, phone, phone_confirmed_at,
    phone_change, phone_change_token, email_change_token_new,
    email_change_confirm_status, banned_until, reauthentication_token,
    reauthentication_sent_at, is_sso_user, deleted_at
  ) VALUES (
    v_user_id, 'radiologist@hospital.com', crypt('password123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dr. Robert Wilson","role":"radiologist"}'::jsonb,
    now(), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000',
    '', '', '', '', NULL, NULL, '', '', '', 0, NULL, '', NULL, false, NULL
  );
  
  INSERT INTO public.staff (
    id, email, full_name, role, department, phone, specialization, license_number, is_active, profile_completed
  ) VALUES (
    v_user_id, 'radiologist@hospital.com', 'Dr. Robert Wilson', 'radiologist',
    'Radiology', '+1-555-0106', 'Diagnostic Radiology', 'RAD-2024-001', true, true
  );
  
  RAISE NOTICE '✅ Created radiologist@hospital.com';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Failed to create radiologist@hospital.com: %', SQLERRM;
END $$;

-- PART 4: Create User 4 - Pharmacist
-- ============================================
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := gen_random_uuid();
  
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'pharmacist@hospital.com') THEN
    RAISE NOTICE '⚠️ pharmacist@hospital.com already exists';
    RETURN;
  END IF;
  
  INSERT INTO auth.users (
    id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    aud, role, instance_id, confirmation_token, recovery_token,
    email_change_token_current, email_change, phone, phone_confirmed_at,
    phone_change, phone_change_token, email_change_token_new,
    email_change_confirm_status, banned_until, reauthentication_token,
    reauthentication_sent_at, is_sso_user, deleted_at
  ) VALUES (
    v_user_id, 'pharmacist@hospital.com', crypt('password123', gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Lisa Anderson","role":"pharmacist"}'::jsonb,
    now(), now(), 'authenticated', 'authenticated', '00000000-0000-0000-0000-000000000000',
    '', '', '', '', NULL, NULL, '', '', '', 0, NULL, '', NULL, false, NULL
  );
  
  INSERT INTO public.staff (
    id, email, full_name, role, department, phone, license_number, is_active, profile_completed
  ) VALUES (
    v_user_id, 'pharmacist@hospital.com', 'Lisa Anderson', 'pharmacist',
    'Pharmacy', '+1-555-0107', 'PHM-2024-001', true, true
  );
  
  RAISE NOTICE '✅ Created pharmacist@hospital.com';
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE '❌ Failed to create pharmacist@hospital.com: %', SQLERRM;
END $$;

-- PART 5: Verify All Users
-- ============================================
SELECT '=== FINAL VERIFICATION ===' as section;

SELECT 
  email,
  role,
  full_name,
  is_active,
  profile_completed
FROM public.staff
ORDER BY email;

SELECT 
  COUNT(*) as total_users,
  CASE 
    WHEN COUNT(*) = 7 THEN '🎉 SUCCESS! All 7 users created!'
    WHEN COUNT(*) >= 3 THEN '⚠️ Only ' || COUNT(*) || ' users exist'
    ELSE '❌ Missing users!'
  END as status
FROM public.staff;

SELECT '✅ Script complete!' as final_status;
SELECT '🔐 All users password: password123' as credentials;
SELECT '🌐 Test at: http://localhost:3001/auth/login' as next_step;

