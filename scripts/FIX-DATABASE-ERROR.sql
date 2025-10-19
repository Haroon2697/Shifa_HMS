-- Fix "Database error querying schema" error
-- This error usually occurs when the trigger function has issues

-- Step 1: Drop the existing trigger (if it exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop the existing function (if it exists)
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 3: Recreate the function with proper error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only insert if the staff record doesn't already exist
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
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'receptionist'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'specialization', NULL),
    COALESCE(NEW.raw_user_meta_data->>'license_number', NULL),
    true,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth operation
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Step 4: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Verify the staff table exists and has correct structure
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'radiologist', 'pharmacist', 'accountant')),
  phone VARCHAR(20),
  department VARCHAR(100),
  specialization VARCHAR(100),
  license_number VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 6: Ensure RLS is enabled
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop and recreate RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.staff;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.staff;
DROP POLICY IF EXISTS "Service role can do anything" ON public.staff;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.staff;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.staff FOR SELECT
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.staff FOR UPDATE
  USING (auth.uid() = id);

-- Allow service role to do anything
CREATE POLICY "Service role can do anything"
  ON public.staff FOR ALL
  USING (true);

-- Allow authenticated users to insert (for the trigger)
CREATE POLICY "Enable insert for authenticated users"
  ON public.staff FOR INSERT
  WITH CHECK (true);

-- Step 8: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.staff TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE ON public.staff TO authenticated;

-- Step 9: Verify setup
SELECT 'Database error fix applied successfully!' as status;

-- Check if staff table exists
SELECT 
  table_name, 
  CASE WHEN EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'staff'
  ) THEN '✅ Exists' ELSE '❌ Missing' END as status
FROM (SELECT 'staff' as table_name) t;

-- Check if trigger exists
SELECT 
  trigger_name,
  event_object_table,
  action_timing,
  event_manipulation,
  '✅ Active' as status
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
