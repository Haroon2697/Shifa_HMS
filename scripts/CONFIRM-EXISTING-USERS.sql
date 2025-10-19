-- Script to manually confirm existing unverified test users
-- Run this if you already have test users but they're not confirmed

-- Confirm all test users that don't have confirmed emails
-- Note: confirmed_at is a generated column, so we only update email_confirmed_at
UPDATE auth.users
SET 
  email_confirmed_at = now()
WHERE email IN (
  'admin@hospital.com',
  'doctor@hospital.com',
  'receptionist@hospital.com',
  'accountant@hospital.com',
  'nurse@hospital.com',
  'radiologist@hospital.com',
  'pharmacist@hospital.com'
)
AND email_confirmed_at IS NULL;

-- Show results
SELECT 
  email, 
  email_confirmed_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmed'
    ELSE '❌ Not Confirmed'
  END as status
FROM auth.users
WHERE email IN (
  'admin@hospital.com',
  'doctor@hospital.com',
  'receptionist@hospital.com',
  'accountant@hospital.com',
  'nurse@hospital.com',
  'radiologist@hospital.com',
  'pharmacist@hospital.com'
)
ORDER BY email;
