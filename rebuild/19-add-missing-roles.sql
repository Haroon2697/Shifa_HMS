-- ============================================
-- STEP 19: ADD MISSING ROLES TO STAFF TABLE
-- ============================================
-- Purpose: Update the role constraint to include all roles
-- Run this in Supabase SQL Editor

-- Check current allowed roles
SELECT 
  '=== CURRENT ROLE CONSTRAINT ===' as section,
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.staff'::regclass
  AND contype = 'c'
  AND conname LIKE '%role%';

-- Drop the old constraint
ALTER TABLE public.staff 
DROP CONSTRAINT IF EXISTS staff_role_check;

-- Add new constraint with all roles
ALTER TABLE public.staff 
ADD CONSTRAINT staff_role_check 
CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'radiologist', 'pharmacist', 'accountant'));

SELECT '✅ Role constraint updated with all 7 roles' as status;

-- Verify the new constraint
SELECT 
  '=== NEW ROLE CONSTRAINT ===' as section,
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.staff'::regclass
  AND contype = 'c'
  AND conname = 'staff_role_check';

SELECT '🎉 ALL ROLES ADDED!' as final_status;
SELECT '✅ Next: Run node scripts/create-additional-users.js' as next_step;
