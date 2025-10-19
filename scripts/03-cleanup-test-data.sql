-- Cleanup script to remove test data
-- Run this script to remove the sample users and related data

-- Delete test users from auth.users (this will cascade to staff table due to foreign key)
DELETE FROM auth.users WHERE email IN (
  'admin@hospital.com',
  'doctor@hospital.com', 
  'receptionist@hospital.com',
  'nurse@hospital.com',
  'radiologist@hospital.com',
  'pharmacist@hospital.com',
  'accountant@hospital.com'
);

-- Delete sample rooms
DELETE FROM public.rooms WHERE room_number IN ('101', '102', '201', '202', '301', '302');

-- Delete any sample patients (if they exist)
DELETE FROM public.patients WHERE patient_id LIKE 'PAT-%';

-- Delete any sample appointments
DELETE FROM public.appointments WHERE id IN (
  SELECT id FROM public.appointments 
  WHERE created_at > CURRENT_DATE - INTERVAL '1 day'
);

-- Reset sequences if needed (optional)
-- ALTER SEQUENCE IF EXISTS public.patients_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS public.invoices_id_seq RESTART WITH 1;
-- ALTER SEQUENCE IF EXISTS public.emergency_cases_id_seq RESTART WITH 1;

-- Show remaining data counts
SELECT 'Remaining users:' as info, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Remaining staff:', COUNT(*) FROM public.staff
UNION ALL
SELECT 'Remaining patients:', COUNT(*) FROM public.patients
UNION ALL
SELECT 'Remaining rooms:', COUNT(*) FROM public.rooms
UNION ALL
SELECT 'Remaining appointments:', COUNT(*) FROM public.appointments;
