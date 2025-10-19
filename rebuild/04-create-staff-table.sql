-- ============================================
-- STEP 4: CREATE STAFF TABLE
-- ============================================
-- Purpose: Build staff table with correct structure (NO foreign keys!)
-- Run this in Supabase SQL Editor

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create staff table with proper structure
-- NOTE: We deliberately do NOT add foreign key to auth.users to avoid cascade issues
CREATE TABLE public.staff (
  -- Primary identifier (matches auth.users.id)
  id UUID PRIMARY KEY,
  
  -- Basic information
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'radiologist', 'pharmacist', 'accountant')),
  
  -- Contact information
  phone VARCHAR(20),
  
  -- Professional information
  department VARCHAR(100),
  specialization VARCHAR(100),      -- For doctors, radiologists
  license_number VARCHAR(50),       -- For medical professionals
  
  -- Status flags
  is_active BOOLEAN DEFAULT true NOT NULL,
  profile_completed BOOLEAN DEFAULT true NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_active ON public.staff(is_active) WHERE is_active = true;

-- Add comment to table
COMMENT ON TABLE public.staff IS 'Staff/employee profiles linked to auth.users by ID (no foreign key for flexibility)';

-- Verification: Check table was created
SELECT 
  '=== VERIFICATION ===' as check_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_tables 
      WHERE schemaname = 'public' AND tablename = 'staff'
    ) THEN '✅ PASS - Staff table created successfully'
    ELSE '❌ FAIL - Staff table not created!'
  END as result;

-- Show table structure
SELECT 
  '=== TABLE STRUCTURE ===' as section,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'staff'
ORDER BY ordinal_position;

-- Show indexes
SELECT 
  '=== INDEXES ===' as section,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'staff';

-- Final status
SELECT '✅ Staff table created with correct structure!' as status;
SELECT '✅ Next: Run rebuild/05-setup-rls.sql to configure security' as next_step;
