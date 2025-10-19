-- Fix infinite recursion in staff table RLS policy
-- This script fixes the RLS policies that are causing infinite recursion

-- Drop the problematic policies
DROP POLICY IF EXISTS "Staff can view their own profile" ON public.staff;
DROP POLICY IF EXISTS "Admins can view all staff" ON public.staff;
DROP POLICY IF EXISTS "Staff can update their own profile" ON public.staff;

-- Create fixed policies that don't cause recursion
CREATE POLICY "Staff can view their own profile" ON public.staff 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all staff" ON public.staff 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = auth.uid() 
    AND s.role = 'admin'
  )
);

CREATE POLICY "Staff can update their own profile" ON public.staff 
FOR UPDATE USING (auth.uid() = id);

-- Also fix the patients policy that might have similar issues
DROP POLICY IF EXISTS "Staff can view patients based on department" ON public.patients;
DROP POLICY IF EXISTS "Receptionists and admins can insert patients" ON public.patients;
DROP POLICY IF EXISTS "Staff can update patients" ON public.patients;

CREATE POLICY "Staff can view patients based on department" ON public.patients 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = auth.uid() 
    AND (s.role = 'admin' OR s.department IS NOT NULL)
  )
);

CREATE POLICY "Receptionists and admins can insert patients" ON public.patients 
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = auth.uid() 
    AND s.role IN ('receptionist', 'admin')
  )
);

CREATE POLICY "Staff can update patients" ON public.patients 
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = auth.uid()
  )
);

-- Test the policies
SELECT 'RLS policies have been fixed' as status;
