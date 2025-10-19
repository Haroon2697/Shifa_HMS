-- Hospital Management System Database Schema with Row Level Security
-- This script creates all necessary tables for the HMS with proper RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Staff/Users table (references Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'radiologist', 'pharmacist', 'accountant')),
  phone VARCHAR(20),
  department VARCHAR(100),
  specialization VARCHAR(100), -- For doctors
  license_number VARCHAR(50), -- For medical professionals
  is_active BOOLEAN DEFAULT true,
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add missing columns if they don't exist (for existing tables)
DO $$ 
BEGIN
    -- Add specialization column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'staff' 
        AND column_name = 'specialization'
    ) THEN
        ALTER TABLE public.staff ADD COLUMN specialization VARCHAR(100);
    END IF;
    
    -- Add license_number column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'staff' 
        AND column_name = 'license_number'
    ) THEN
        ALTER TABLE public.staff ADD COLUMN license_number VARCHAR(50);
    END IF;
    
    -- Add profile_completed column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'staff' 
        AND column_name = 'profile_completed'
    ) THEN
        ALTER TABLE public.staff ADD COLUMN profile_completed BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
  blood_group VARCHAR(5),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  medical_history TEXT,
  allergies TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  appointment_type VARCHAR(50) CHECK (appointment_type IN ('consultation', 'follow-up', 'emergency')),
  reason_for_visit TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OPD (Outpatient Department) Consultations
CREATE TABLE IF NOT EXISTS public.opd_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  consultation_date TIMESTAMP NOT NULL,
  symptoms TEXT NOT NULL,
  diagnosis TEXT,
  treatment_plan TEXT,
  prescribed_medicines TEXT,
  follow_up_date DATE,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms/Wards table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number VARCHAR(50) UNIQUE NOT NULL,
  room_type VARCHAR(50) NOT NULL CHECK (room_type IN ('general', 'semi-private', 'private', 'icu', 'icu-hd')),
  floor_number INT,
  capacity INT DEFAULT 1,
  available_beds INT DEFAULT 1,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
  daily_rate DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admissions table
CREATE TABLE IF NOT EXISTS public.admissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  admission_date TIMESTAMP NOT NULL,
  discharge_date TIMESTAMP,
  admission_type VARCHAR(50) CHECK (admission_type IN ('emergency', 'planned', 'transfer')),
  reason_for_admission TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'discharged', 'transferred')),
  assigned_doctor_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Operation Theatre (OT) Schedule
CREATE TABLE IF NOT EXISTS public.ot_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  surgeon_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  anesthetist_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  operation_date DATE NOT NULL,
  operation_time TIME NOT NULL,
  operation_type VARCHAR(100) NOT NULL,
  estimated_duration INT,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled')),
  pre_op_notes TEXT,
  post_op_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Radiology (Imaging) Tests
CREATE TABLE IF NOT EXISTS public.radiology_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  ordered_by_doctor_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  test_type VARCHAR(100) NOT NULL CHECK (test_type IN ('X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'ECG')),
  test_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'reported')),
  findings TEXT,
  report_file_url VARCHAR(500),
  radiologist_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Cases
CREATE TABLE IF NOT EXISTS public.emergency_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  case_number VARCHAR(50) UNIQUE NOT NULL,
  arrival_time TIMESTAMP NOT NULL,
  chief_complaint TEXT NOT NULL,
  severity_level VARCHAR(50) CHECK (severity_level IN ('critical', 'high', 'moderate', 'low')),
  assigned_doctor_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'admitted', 'discharged', 'transferred')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing/Invoices
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  admission_id UUID REFERENCES public.admissions(id) ON DELETE SET NULL,
  invoice_date TIMESTAMP NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  net_amount DECIMAL(12, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'cancelled')),
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice Items (line items for billing)
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('room', 'consultation', 'surgery', 'test', 'medicine', 'procedure')),
  description TEXT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medicines/Pharmacy
CREATE TABLE IF NOT EXISTS public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  manufacturer VARCHAR(255),
  batch_number VARCHAR(100),
  expiry_date DATE,
  quantity_in_stock INT DEFAULT 0,
  unit_price DECIMAL(10, 2),
  reorder_level INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  prescription_date TIMESTAMP NOT NULL,
  medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration_days INT,
  quantity INT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security on all tables
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opd_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ot_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.radiology_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- IDEMPOTENT RLS POLICIES
-- =============================================

-- Function to safely create policies
CREATE OR REPLACE FUNCTION create_policy_if_not_exists(
    policy_name TEXT,
    table_name TEXT,
    command TEXT,
    using_expression TEXT DEFAULT NULL,
    with_check_expression TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = table_name 
        AND policyname = policy_name
    ) THEN
        EXECUTE format(
            'CREATE POLICY "%s" ON public.%I FOR %s %s %s',
            policy_name,
            table_name,
            command,
            CASE WHEN using_expression IS NOT NULL THEN 'USING (' || using_expression || ')' ELSE '' END,
            CASE WHEN with_check_expression IS NOT NULL THEN 'WITH CHECK (' || with_check_expression || ')' ELSE '' END
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies for Staff table
SELECT create_policy_if_not_exists('Staff can view their own profile', 'staff', 'SELECT', 'auth.uid() = id');
SELECT create_policy_if_not_exists('Admins can view all staff', 'staff', 'SELECT', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role = ''admin'')');
SELECT create_policy_if_not_exists('Staff can update their own profile', 'staff', 'UPDATE', 'auth.uid() = id');

-- RLS Policies for Patients table
SELECT create_policy_if_not_exists('Staff can view patients based on department', 'patients', 'SELECT', 'EXISTS (SELECT 1 FROM public.staff s WHERE s.id = auth.uid() AND (s.role = ''admin'' OR s.department IS NOT NULL))');
SELECT create_policy_if_not_exists('Receptionists and admins can insert patients', 'patients', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role IN (''receptionist'', ''admin''))');
SELECT create_policy_if_not_exists('Staff can update patients', 'patients', 'UPDATE', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');

-- RLS Policies for Appointments table
SELECT create_policy_if_not_exists('Doctors can view their appointments', 'appointments', 'SELECT', 'doctor_id = auth.uid() OR EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role = ''admin'')');
SELECT create_policy_if_not_exists('Authenticated staff can insert appointments', 'appointments', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');
SELECT create_policy_if_not_exists('Authenticated staff can update appointments', 'appointments', 'UPDATE', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');

-- RLS Policies for OPD Consultations
SELECT create_policy_if_not_exists('Doctors can view their consultations', 'opd_consultations', 'SELECT', 'doctor_id = auth.uid() OR EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role = ''admin'')');
SELECT create_policy_if_not_exists('Authenticated staff can insert consultations', 'opd_consultations', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');
SELECT create_policy_if_not_exists('Authenticated staff can update consultations', 'opd_consultations', 'UPDATE', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');

-- RLS Policies for Rooms
SELECT create_policy_if_not_exists('Authenticated staff can view rooms', 'rooms', 'SELECT', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');
SELECT create_policy_if_not_exists('Admins can manage rooms', 'rooms', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role = ''admin'')');
SELECT create_policy_if_not_exists('Admins can update rooms', 'rooms', 'UPDATE', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role = ''admin'')');

-- RLS Policies for Admissions
SELECT create_policy_if_not_exists('Authenticated staff can view admissions', 'admissions', 'SELECT', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');
SELECT create_policy_if_not_exists('Authenticated staff can insert admissions', 'admissions', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');
SELECT create_policy_if_not_exists('Authenticated staff can update admissions', 'admissions', 'UPDATE', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');

-- RLS Policies for OT Schedules
SELECT create_policy_if_not_exists('Surgeons can view their schedules', 'ot_schedules', 'SELECT', 'surgeon_id = auth.uid() OR anesthetist_id = auth.uid() OR EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role = ''admin'')');
SELECT create_policy_if_not_exists('Authenticated staff can insert OT schedules', 'ot_schedules', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');
SELECT create_policy_if_not_exists('Authenticated staff can update OT schedules', 'ot_schedules', 'UPDATE', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');

-- RLS Policies for Radiology Tests
SELECT create_policy_if_not_exists('Radiologists can view their tests', 'radiology_tests', 'SELECT', 'radiologist_id = auth.uid() OR ordered_by_doctor_id = auth.uid() OR EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role = ''admin'')');
SELECT create_policy_if_not_exists('Authenticated staff can insert radiology tests', 'radiology_tests', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');
SELECT create_policy_if_not_exists('Authenticated staff can update radiology tests', 'radiology_tests', 'UPDATE', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');

-- RLS Policies for Emergency Cases
SELECT create_policy_if_not_exists('Authenticated staff can view emergency cases', 'emergency_cases', 'SELECT', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');
SELECT create_policy_if_not_exists('Authenticated staff can insert emergency cases', 'emergency_cases', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');
SELECT create_policy_if_not_exists('Authenticated staff can update emergency cases', 'emergency_cases', 'UPDATE', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');

-- RLS Policies for Invoices
SELECT create_policy_if_not_exists('Accountants can view invoices', 'invoices', 'SELECT', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role IN (''accountant'', ''admin''))');
SELECT create_policy_if_not_exists('Accountants can insert invoices', 'invoices', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role IN (''accountant'', ''admin''))');
SELECT create_policy_if_not_exists('Accountants can update invoices', 'invoices', 'UPDATE', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role IN (''accountant'', ''admin''))');

-- RLS Policies for Invoice Items
SELECT create_policy_if_not_exists('Accountants can view invoice items', 'invoice_items', 'SELECT', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role IN (''accountant'', ''admin''))');
SELECT create_policy_if_not_exists('Accountants can insert invoice items', 'invoice_items', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role IN (''accountant'', ''admin''))');

-- RLS Policies for Medicines
SELECT create_policy_if_not_exists('Authenticated staff can view medicines', 'medicines', 'SELECT', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid())');
SELECT create_policy_if_not_exists('Pharmacists can manage medicines', 'medicines', 'INSERT', NULL, 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role IN (''pharmacist'', ''admin''))');
SELECT create_policy_if_not_exists('Pharmacists can update medicines', 'medicines', 'UPDATE', 'EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role IN (''pharmacist'', ''admin''))');

-- RLS Policies for Prescriptions
SELECT create_policy_if_not_exists('Doctors can view their prescriptions', 'prescriptions', 'SELECT', 'doctor_id = auth.uid() OR EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role = ''admin'')');
SELECT create_policy_if_not_exists('Doctors can insert prescriptions', 'prescriptions', 'INSERT', NULL, 'doctor_id = auth.uid()');
SELECT create_policy_if_not_exists('Doctors can update prescriptions', 'prescriptions', 'UPDATE', 'doctor_id = auth.uid()');

-- Drop the helper function
DROP FUNCTION create_policy_if_not_exists;

-- =============================================
-- DATA INTEGRITY CONSTRAINTS
-- =============================================

-- Function to safely add constraints
CREATE OR REPLACE FUNCTION add_constraint_if_not_exists(
    p_table_name TEXT,
    p_constraint_name TEXT,
    p_constraint_definition TEXT
) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints tc
        WHERE tc.constraint_schema = 'public' 
        AND tc.table_name = p_table_name 
        AND tc.constraint_name = p_constraint_name
    ) THEN
        EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I %s', p_table_name, p_constraint_name, p_constraint_definition);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Add constraints safely
SELECT add_constraint_if_not_exists('admissions', 'check_discharge_date', 'CHECK (discharge_date IS NULL OR discharge_date >= admission_date)');
SELECT add_constraint_if_not_exists('ot_schedules', 'check_operation_date', 'CHECK (operation_date >= CURRENT_DATE)');
SELECT add_constraint_if_not_exists('appointments', 'check_appointment_date', 'CHECK (appointment_date >= CURRENT_DATE)');
SELECT add_constraint_if_not_exists('invoices', 'check_positive_amounts', 'CHECK (total_amount >= 0 AND discount_amount >= 0 AND tax_amount >= 0 AND net_amount >= 0)');
SELECT add_constraint_if_not_exists('medicines', 'check_positive_stock', 'CHECK (quantity_in_stock >= 0)');

-- Drop the helper function
DROP FUNCTION add_constraint_if_not_exists;

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate patient ID
CREATE OR REPLACE FUNCTION generate_patient_id()
RETURNS TRIGGER AS $$
DECLARE
    year_text TEXT;
    sequence_num INT;
    new_patient_id TEXT;
BEGIN
    year_text := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(patient_id FROM 5) AS INT)), 0) + 1 
    INTO sequence_num
    FROM public.patients 
    WHERE patient_id LIKE 'PAT-' || year_text || '%';
    
    -- Format: PAT-YYYY-0001
    new_patient_id := 'PAT-' || year_text || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    NEW.patient_id := new_patient_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    year_text TEXT;
    sequence_num INT;
    new_invoice_number TEXT;
BEGIN
    year_text := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INT)), 0) + 1 
    INTO sequence_num
    FROM public.invoices 
    WHERE invoice_number LIKE 'INV-' || year_text || '%';
    
    -- Format: INV-YYYY-0001
    new_invoice_number := 'INV-' || year_text || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    NEW.invoice_number := new_invoice_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate emergency case number
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
DECLARE
    year_text TEXT;
    sequence_num INT;
    new_case_number TEXT;
BEGIN
    year_text := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(case_number FROM 5) AS INT)), 0) + 1 
    INTO sequence_num
    FROM public.emergency_cases 
    WHERE case_number LIKE 'EMR-' || year_text || '%';
    
    -- Format: EMR-YYYY-0001
    new_case_number := 'EMR-' || year_text || '-' || LPAD(sequence_num::TEXT, 4, '0');
    
    NEW.case_number := new_case_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Triggers for updated_at timestamps (idempotent)
DO $$
BEGIN
    -- Staff table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_staff_updated_at') THEN
        CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Patients table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_patients_updated_at') THEN
        CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Appointments table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_appointments_updated_at') THEN
        CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- OPD consultations table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_opd_consultations_updated_at') THEN
        CREATE TRIGGER update_opd_consultations_updated_at BEFORE UPDATE ON public.opd_consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Rooms table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rooms_updated_at') THEN
        CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Admissions table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_admissions_updated_at') THEN
        CREATE TRIGGER update_admissions_updated_at BEFORE UPDATE ON public.admissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- OT schedules table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_ot_schedules_updated_at') THEN
        CREATE TRIGGER update_ot_schedules_updated_at BEFORE UPDATE ON public.ot_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Radiology tests table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_radiology_tests_updated_at') THEN
        CREATE TRIGGER update_radiology_tests_updated_at BEFORE UPDATE ON public.radiology_tests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Emergency cases table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_emergency_cases_updated_at') THEN
        CREATE TRIGGER update_emergency_cases_updated_at BEFORE UPDATE ON public.emergency_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Invoices table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_invoices_updated_at') THEN
        CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Medicines table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_medicines_updated_at') THEN
        CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON public.medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Prescriptions table trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_prescriptions_updated_at') THEN
        CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Triggers for auto-generating IDs (idempotent)
DO $$
BEGIN
    -- Patient ID trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'generate_patient_id_trigger') THEN
        CREATE TRIGGER generate_patient_id_trigger
            BEFORE INSERT ON public.patients
            FOR EACH ROW
            WHEN (NEW.patient_id IS NULL)
            EXECUTE FUNCTION generate_patient_id();
    END IF;
    
    -- Invoice number trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'generate_invoice_number_trigger') THEN
        CREATE TRIGGER generate_invoice_number_trigger
            BEFORE INSERT ON public.invoices
            FOR EACH ROW
            WHEN (NEW.invoice_number IS NULL)
            EXECUTE FUNCTION generate_invoice_number();
    END IF;
    
    -- Case number trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'generate_case_number_trigger') THEN
        CREATE TRIGGER generate_case_number_trigger
            BEFORE INSERT ON public.emergency_cases
            FOR EACH ROW
            WHEN (NEW.case_number IS NULL)
            EXECUTE FUNCTION generate_case_number();
    END IF;
END $$;

-- =============================================
-- AUDIT LOGGING
-- =============================================

-- Audit table for tracking important changes
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES public.staff(id),
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policy for audit log (only admins can view)
CREATE POLICY "Only admins can view audit log" ON public.audit_log FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.staff WHERE id = auth.uid() AND role = 'admin')
);

-- =============================================
-- VIEWS
-- =============================================

-- View for patient summary with latest information
CREATE OR REPLACE VIEW public.patient_summary AS
SELECT 
    p.id,
    p.patient_id,
    p.first_name,
    p.last_name,
    p.date_of_birth,
    p.gender,
    p.blood_group,
    p.phone,
    p.email,
    (SELECT COUNT(*) FROM public.appointments a WHERE a.patient_id = p.id) as total_appointments,
    (SELECT COUNT(*) FROM public.admissions a WHERE a.patient_id = p.id) as total_admissions,
    (SELECT MAX(consultation_date) FROM public.opd_consultations oc WHERE oc.patient_id = p.id) as last_consultation,
    (SELECT MAX(invoice_date) FROM public.invoices i WHERE i.patient_id = p.id) as last_billing_date
FROM public.patients p
WHERE p.is_active = true;

-- View for room availability
CREATE OR REPLACE VIEW public.room_availability AS
SELECT 
    r.id,
    r.room_number,
    r.room_type,
    r.floor_number,
    r.capacity,
    r.available_beds,
    r.status,
    r.daily_rate,
    (r.capacity - r.available_beds) as occupied_beds,
    ROUND((r.capacity - r.available_beds)::DECIMAL / r.capacity * 100, 2) as occupancy_percentage
FROM public.rooms r;

-- View for appointment summary
CREATE OR REPLACE VIEW public.appointment_summary AS
SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.status,
    a.appointment_type,
    p.patient_id,
    p.first_name || ' ' || p.last_name as patient_name,
    s.full_name as doctor_name,
    s.specialization,
    s.role as doctor_role
FROM public.appointments a
JOIN public.patients p ON a.patient_id = p.id
JOIN public.staff s ON a.doctor_id = s.id
WHERE a.appointment_date >= CURRENT_DATE - INTERVAL '30 days';

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Basic indexes
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff(role);
CREATE INDEX IF NOT EXISTS idx_patients_email ON public.patients(email);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_admissions_patient_id ON public.admissions(patient_id);
CREATE INDEX IF NOT EXISTS idx_admissions_room_id ON public.admissions(room_id);
CREATE INDEX IF NOT EXISTS idx_invoices_patient_id ON public.invoices(patient_id);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON public.invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_ot_schedules_date ON public.ot_schedules(operation_date);
CREATE INDEX IF NOT EXISTS idx_radiology_tests_patient_id ON public.radiology_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_emergency_cases_arrival_time ON public.emergency_cases(arrival_time);

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_patients_phone ON public.patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_name ON public.patients(first_name, last_name);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON public.admissions(status);
CREATE INDEX IF NOT EXISTS idx_medicines_stock ON public.medicines(quantity_in_stock) WHERE quantity_in_stock > 0;
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(payment_status);
CREATE INDEX IF NOT EXISTS idx_emergency_cases_severity ON public.emergency_cases(severity_level);
CREATE INDEX IF NOT EXISTS idx_emergency_cases_status ON public.emergency_cases(status);
CREATE INDEX IF NOT EXISTS idx_ot_schedules_status ON public.ot_schedules(status);
CREATE INDEX IF NOT EXISTS idx_radiology_tests_status ON public.radiology_tests(status);
CREATE INDEX IF NOT EXISTS idx_medicines_expiry ON public.medicines(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON public.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_changed_at ON public.audit_log(changed_at);

-- Function to create staff profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into staff table with default values
  INSERT INTO public.staff (id, email, full_name, role, department, is_active, profile_completed)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'receptionist'),
    COALESCE(NEW.raw_user_meta_data->>'department', 'General'),
    true,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create staff profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sample data for testing different roles
-- Create test users for each role (only if they don't exist)
DO $$
BEGIN
  -- Admin user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@hospital.com') THEN
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
      raw_user_meta_data, raw_app_meta_data, is_super_admin, role
    ) VALUES (
      gen_random_uuid(), 'admin@hospital.com', crypt('password123', gen_salt('bf')),
      now(), now(), now(), 
      '{"full_name": "System Administrator", "role": "admin", "department": "Administration"}',
      '{"provider": "email", "providers": ["email"]}', false, 'authenticated'
    );
  END IF;

  -- Doctor user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'doctor@hospital.com') THEN
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
      raw_user_meta_data, raw_app_meta_data, is_super_admin, role
    ) VALUES (
      gen_random_uuid(), 'doctor@hospital.com', crypt('password123', gen_salt('bf')),
      now(), now(), now(),
      '{"full_name": "Dr. Sarah Johnson", "role": "doctor", "department": "Cardiology", "specialization": "Cardiologist", "license_number": "MD12345"}',
      '{"provider": "email", "providers": ["email"]}', false, 'authenticated'
    );
  END IF;

  -- Receptionist user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'receptionist@hospital.com') THEN
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
      raw_user_meta_data, raw_app_meta_data, is_super_admin, role
    ) VALUES (
      gen_random_uuid(), 'receptionist@hospital.com', crypt('password123', gen_salt('bf')),
      now(), now(), now(),
      '{"full_name": "Jane Smith", "role": "receptionist", "department": "Reception"}',
      '{"provider": "email", "providers": ["email"]}', false, 'authenticated'
    );
  END IF;

  -- Nurse user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'nurse@hospital.com') THEN
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
      raw_user_meta_data, raw_app_meta_data, is_super_admin, role
    ) VALUES (
      gen_random_uuid(), 'nurse@hospital.com', crypt('password123', gen_salt('bf')),
      now(), now(), now(),
      '{"full_name": "Mike Wilson", "role": "nurse", "department": "ICU"}',
      '{"provider": "email", "providers": ["email"]}', false, 'authenticated'
    );
  END IF;

  -- Radiologist user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'radiologist@hospital.com') THEN
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
      raw_user_meta_data, raw_app_meta_data, is_super_admin, role
    ) VALUES (
      gen_random_uuid(), 'radiologist@hospital.com', crypt('password123', gen_salt('bf')),
      now(), now(), now(),
      '{"full_name": "Dr. Emily Davis", "role": "radiologist", "department": "Radiology", "specialization": "Diagnostic Radiology", "license_number": "RAD67890"}',
      '{"provider": "email", "providers": ["email"]}', false, 'authenticated'
    );
  END IF;

  -- Pharmacist user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'pharmacist@hospital.com') THEN
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
      raw_user_meta_data, raw_app_meta_data, is_super_admin, role
    ) VALUES (
      gen_random_uuid(), 'pharmacist@hospital.com', crypt('password123', gen_salt('bf')),
      now(), now(), now(),
      '{"full_name": "Robert Brown", "role": "pharmacist", "department": "Pharmacy", "license_number": "PHARM54321"}',
      '{"provider": "email", "providers": ["email"]}', false, 'authenticated'
    );
  END IF;

  -- Accountant user
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'accountant@hospital.com') THEN
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
      raw_user_meta_data, raw_app_meta_data, is_super_admin, role
    ) VALUES (
      gen_random_uuid(), 'accountant@hospital.com', crypt('password123', gen_salt('bf')),
      now(), now(), now(),
      '{"full_name": "Lisa Anderson", "role": "accountant", "department": "Finance"}',
      '{"provider": "email", "providers": ["email"]}', false, 'authenticated'
    );
  END IF;
END $$;

-- Update staff profiles with complete information
UPDATE public.staff SET 
  full_name = 'System Administrator',
  role = 'admin',
  department = 'Administration',
  profile_completed = true
WHERE email = 'admin@hospital.com';

UPDATE public.staff SET 
  full_name = 'Dr. Sarah Johnson',
  role = 'doctor',
  department = 'Cardiology',
  specialization = 'Cardiologist',
  license_number = 'MD12345',
  profile_completed = true
WHERE email = 'doctor@hospital.com';

UPDATE public.staff SET 
  full_name = 'Jane Smith',
  role = 'receptionist',
  department = 'Reception',
  profile_completed = true
WHERE email = 'receptionist@hospital.com';

UPDATE public.staff SET 
  full_name = 'Mike Wilson',
  role = 'nurse',
  department = 'ICU',
  profile_completed = true
WHERE email = 'nurse@hospital.com';

UPDATE public.staff SET 
  full_name = 'Dr. Emily Davis',
  role = 'radiologist',
  department = 'Radiology',
  specialization = 'Diagnostic Radiology',
  license_number = 'RAD67890',
  profile_completed = true
WHERE email = 'radiologist@hospital.com';

UPDATE public.staff SET 
  full_name = 'Robert Brown',
  role = 'pharmacist',
  department = 'Pharmacy',
  license_number = 'PHARM54321',
  profile_completed = true
WHERE email = 'pharmacist@hospital.com';

UPDATE public.staff SET 
  full_name = 'Lisa Anderson',
  role = 'accountant',
  department = 'Finance',
  profile_completed = true
WHERE email = 'accountant@hospital.com';

-- Add some sample rooms for testing
INSERT INTO public.rooms (room_number, room_type, floor_number, capacity, available_beds, status, daily_rate)
VALUES 
('101', 'general', 1, 2, 2, 'available', 150.00),
('102', 'general', 1, 2, 1, 'available', 150.00),
('201', 'semi-private', 2, 1, 1, 'available', 250.00),
('202', 'private', 2, 1, 1, 'available', 400.00),
('301', 'icu', 3, 1, 1, 'available', 800.00),
('302', 'icu-hd', 3, 1, 1, 'available', 1200.00)
-- Note: room_number has UNIQUE constraint, conflicts will be handled by the constraint

