-- COMPLETE DATABASE RESET SCRIPT
-- WARNING: This will delete ALL data in your database!
-- Only run this if you want to start completely fresh

-- Drop all tables in the correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS public.prescriptions CASCADE;
DROP TABLE IF EXISTS public.medicines CASCADE;
DROP TABLE IF EXISTS public.invoice_items CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.emergency_cases CASCADE;
DROP TABLE IF EXISTS public.radiology_tests CASCADE;
DROP TABLE IF EXISTS public.ot_schedules CASCADE;
DROP TABLE IF EXISTS public.admissions CASCADE;
DROP TABLE IF EXISTS public.rooms CASCADE;
DROP TABLE IF EXISTS public.opd_consultations CASCADE;
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.patients CASCADE;
DROP TABLE IF EXISTS public.staff CASCADE;

-- Drop all views
DROP VIEW IF EXISTS public.patient_summary CASCADE;
DROP VIEW IF EXISTS public.room_availability CASCADE;
DROP VIEW IF EXISTS public.appointment_summary CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.generate_patient_id() CASCADE;
DROP FUNCTION IF EXISTS public.generate_invoice_number() CASCADE;
DROP FUNCTION IF EXISTS public.generate_case_number() CASCADE;

-- Drop all triggers (they should be dropped with tables, but just in case)
-- Note: Triggers are automatically dropped when tables are dropped

-- Drop the audit log table if it exists
DROP TABLE IF EXISTS public.audit_log CASCADE;

-- Show confirmation
SELECT 'Database has been completely reset. All tables, views, functions, and data have been removed.' as status;
