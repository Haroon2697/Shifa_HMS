-- QUICK SETUP: Run this in Supabase SQL Editor to fix authentication issues
-- This script:
-- 1. Creates test users
-- 2. Ensures the staff table exists
-- 3. Sets up the trigger for automatic profile creation

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Ensure staff table exists with all required columns
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

-- Enable Row Level Security
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for staff table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.staff;
CREATE POLICY "Users can view their own profile"
  ON public.staff FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.staff;
CREATE POLICY "Users can update their own profile"
  ON public.staff FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can do anything" ON public.staff;
CREATE POLICY "Service role can do anything"
  ON public.staff FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- Function to create staff profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.staff (id, email, full_name, role, department, phone, specialization, license_number, is_active, profile_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (drop if exists first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Delete existing test users first (if they exist and are unverified)
DELETE FROM auth.users WHERE email IN (
  'admin@hospital.com',
  'doctor@hospital.com',
  'receptionist@hospital.com',
  'accountant@hospital.com'
) AND email_confirmed_at IS NULL;

-- Create test users with EMAIL ALREADY CONFIRMED (ONLY IF THEY DON'T EXIST)
DO $$
DECLARE
  admin_id UUID;
  doctor_id UUID;
  receptionist_id UUID;
  accountant_id UUID;
BEGIN
  -- Admin user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@hospital.com') THEN
    admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_id,
      'authenticated',
      'authenticated',
      'admin@hospital.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "System Administrator", "role": "admin", "department": "Administration"}',
      false,
      now(),
      now()
    );
    
    -- Create staff profile for admin
    INSERT INTO public.staff (id, email, full_name, role, department, is_active, profile_completed)
    VALUES (admin_id, 'admin@hospital.com', 'System Administrator', 'admin', 'Administration', true, true)
    ON CONFLICT (id) DO UPDATE SET profile_completed = true;
  END IF;

  -- Doctor user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'doctor@hospital.com') THEN
    doctor_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      doctor_id,
      'authenticated',
      'authenticated',
      'doctor@hospital.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Dr. Sarah Johnson", "role": "doctor", "department": "Cardiology"}',
      false,
      now(),
      now()
    );
    
    INSERT INTO public.staff (id, email, full_name, role, department, specialization, license_number, is_active, profile_completed)
    VALUES (doctor_id, 'doctor@hospital.com', 'Dr. Sarah Johnson', 'doctor', 'Cardiology', 'Cardiologist', 'MD12345', true, true)
    ON CONFLICT (id) DO UPDATE SET profile_completed = true;
  END IF;

  -- Receptionist user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'receptionist@hospital.com') THEN
    receptionist_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      receptionist_id,
      'authenticated',
      'authenticated',
      'receptionist@hospital.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Jane Smith", "role": "receptionist", "department": "Reception"}',
      false,
      now(),
      now()
    );
    
    INSERT INTO public.staff (id, email, full_name, role, department, is_active, profile_completed)
    VALUES (receptionist_id, 'receptionist@hospital.com', 'Jane Smith', 'receptionist', 'Reception', true, true)
    ON CONFLICT (id) DO UPDATE SET profile_completed = true;
  END IF;

  -- Accountant user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'accountant@hospital.com') THEN
    accountant_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      accountant_id,
      'authenticated',
      'authenticated',
      'accountant@hospital.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "Lisa Anderson", "role": "accountant", "department": "Finance"}',
      false,
      now(),
      now()
    );
    
    INSERT INTO public.staff (id, email, full_name, role, department, is_active, profile_completed)
    VALUES (accountant_id, 'accountant@hospital.com', 'Lisa Anderson', 'accountant', 'Finance', true, true)
    ON CONFLICT (id) DO UPDATE SET profile_completed = true;
  END IF;
END $$;

-- Verify the setup
SELECT 'Test users created successfully!' as status;
SELECT email, role, full_name FROM public.staff ORDER BY created_at;
