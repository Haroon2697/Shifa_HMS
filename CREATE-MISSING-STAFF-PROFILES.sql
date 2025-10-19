-- ============================================
-- CREATE MISSING STAFF PROFILES
-- ============================================
-- This creates staff profiles for users that exist in auth.users
-- but don't have a corresponding staff record
-- ============================================

-- First, let's see which users are missing staff profiles
SELECT 
  '=== USERS MISSING STAFF PROFILES ===' as section,
  u.id,
  u.email,
  u.raw_user_meta_data->>'role' as intended_role,
  u.raw_user_meta_data->>'full_name' as intended_name
FROM auth.users u
LEFT JOIN public.staff s ON u.id = s.id
WHERE s.id IS NULL
ORDER BY u.email;

-- Now create staff profiles for ALL missing users
-- We'll extract role and name from user_metadata where possible
DO $$
DECLARE
  user_record RECORD;
  v_role text;
  v_full_name text;
BEGIN
  FOR user_record IN 
    SELECT 
      u.id,
      u.email,
      u.raw_user_meta_data
    FROM auth.users u
    LEFT JOIN public.staff s ON u.id = s.id
    WHERE s.id IS NULL
  LOOP
    -- Extract role and name from metadata
    v_role := user_record.raw_user_meta_data->>'role';
    v_full_name := user_record.raw_user_meta_data->>'full_name';
    
    -- Default values if not in metadata
    IF v_role IS NULL THEN
      v_role := 'receptionist'; -- Default role
    END IF;
    
    IF v_full_name IS NULL OR v_full_name = '' THEN
      v_full_name := split_part(user_record.email, '@', 1); -- Use email prefix
    END IF;
    
    -- Determine department based on role
    DECLARE
      v_department text;
      v_specialization text;
      v_license text;
    BEGIN
      CASE v_role
        WHEN 'admin' THEN
          v_department := 'Administration';
          v_specialization := NULL;
          v_license := NULL;
        WHEN 'doctor' THEN
          v_department := 'General Medicine';
          v_specialization := 'General Physician';
          v_license := 'MD-' || substring(user_record.id::text, 1, 8);
        WHEN 'nurse' THEN
          v_department := 'General Ward';
          v_specialization := 'General Nursing';
          v_license := 'RN-' || substring(user_record.id::text, 1, 8);
        WHEN 'receptionist' THEN
          v_department := 'Front Desk';
          v_specialization := NULL;
          v_license := NULL;
        WHEN 'radiologist' THEN
          v_department := 'Radiology';
          v_specialization := 'Diagnostic Radiology';
          v_license := 'RAD-' || substring(user_record.id::text, 1, 8);
        WHEN 'pharmacist' THEN
          v_department := 'Pharmacy';
          v_specialization := NULL;
          v_license := 'PHM-' || substring(user_record.id::text, 1, 8);
        WHEN 'accountant' THEN
          v_department := 'Finance';
          v_specialization := NULL;
          v_license := NULL;
        ELSE
          v_department := 'General';
          v_specialization := NULL;
          v_license := NULL;
      END CASE;
      
      -- Insert staff profile
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
        user_record.id,
        user_record.email,
        v_full_name,
        v_role,
        v_department,
        '+1-555-0100',
        v_specialization,
        v_license,
        true,
        true
      );
      
      RAISE NOTICE '✅ Created staff profile for % (%) - Role: %', 
        user_record.email, v_full_name, v_role;
        
    EXCEPTION
      WHEN OTHERS THEN
        RAISE NOTICE '❌ Failed to create staff profile for %: %', 
          user_record.email, SQLERRM;
    END;
  END LOOP;
END $$;

-- Verify the results
SELECT 
  '=== VERIFICATION ===' as section,
  (SELECT COUNT(*) FROM auth.users) as auth_users,
  (SELECT COUNT(*) FROM public.staff) as staff_profiles,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users) = (SELECT COUNT(*) FROM public.staff)
    THEN '✅ All users now have staff profiles!'
    ELSE '❌ Still have mismatches'
  END as status;

-- Show all staff profiles
SELECT 
  '=== ALL STAFF PROFILES ===' as section,
  email,
  role,
  full_name,
  department,
  is_active,
  profile_completed
FROM public.staff
ORDER BY role, email;

SELECT '🎉 Staff profile creation complete!' as final_status;
SELECT '🔐 All users password: password123' as credentials;
SELECT '🌐 Test at: http://localhost:3001/auth/login' as next_step;

