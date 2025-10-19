-- Hospital Management System Database Schema
-- This script creates all necessary tables for the HMS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for authentication and staff)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
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

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  doctor_id UUID NOT NULL REFERENCES users(id),
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
CREATE TABLE opd_consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES appointments(id),
  patient_id UUID NOT NULL REFERENCES patients(id),
  doctor_id UUID NOT NULL REFERENCES users(id),
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
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE admissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  room_id UUID NOT NULL REFERENCES rooms(id),
  admission_date TIMESTAMP NOT NULL,
  discharge_date TIMESTAMP,
  admission_type VARCHAR(50) CHECK (admission_type IN ('emergency', 'planned', 'transfer')),
  reason_for_admission TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'discharged', 'transferred')),
  assigned_doctor_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Operation Theatre (OT) Schedule
CREATE TABLE ot_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  surgeon_id UUID NOT NULL REFERENCES users(id),
  anesthetist_id UUID REFERENCES users(id),
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
CREATE TABLE radiology_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  ordered_by_doctor_id UUID NOT NULL REFERENCES users(id),
  test_type VARCHAR(100) NOT NULL CHECK (test_type IN ('X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'ECG')),
  test_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'reported')),
  findings TEXT,
  report_file_url VARCHAR(500),
  radiologist_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Cases
CREATE TABLE emergency_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id),
  case_number VARCHAR(50) UNIQUE NOT NULL,
  arrival_time TIMESTAMP NOT NULL,
  chief_complaint TEXT NOT NULL,
  severity_level VARCHAR(50) CHECK (severity_level IN ('critical', 'high', 'moderate', 'low')),
  assigned_doctor_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'admitted', 'discharged', 'transferred')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing/Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  patient_id UUID NOT NULL REFERENCES patients(id),
  admission_id UUID REFERENCES admissions(id),
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
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('room', 'consultation', 'surgery', 'test', 'medicine', 'procedure')),
  description TEXT NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medicines/Pharmacy
CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  doctor_id UUID NOT NULL REFERENCES users(id),
  prescription_date TIMESTAMP NOT NULL,
  medicine_id UUID NOT NULL REFERENCES medicines(id),
  dosage VARCHAR(100) NOT NULL,
  frequency VARCHAR(100) NOT NULL,
  duration_days INT,
  quantity INT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_admissions_patient_id ON admissions(patient_id);
CREATE INDEX idx_admissions_room_id ON admissions(room_id);
CREATE INDEX idx_invoices_patient_id ON invoices(patient_id);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_ot_schedules_date ON ot_schedules(operation_date);
CREATE INDEX idx_radiology_tests_patient_id ON radiology_tests(patient_id);
CREATE INDEX idx_emergency_cases_arrival_time ON emergency_cases(arrival_time);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Sample data for testing different roles
INSERT INTO users (email, password_hash, full_name, role, department, specialization, license_number, is_active, profile_completed)
VALUES 
-- Admin user
('admin@hospital.com', crypt('password123', gen_salt('bf')), 'System Administrator', 'admin', 'Administration', NULL, NULL, true, true),
-- Doctor user
('doctor@hospital.com', crypt('password123', gen_salt('bf')), 'Dr. Sarah Johnson', 'doctor', 'Cardiology', 'Cardiologist', 'MD12345', true, true),
-- Receptionist user
('receptionist@hospital.com', crypt('password123', gen_salt('bf')), 'Jane Smith', 'receptionist', 'Reception', NULL, NULL, true, true),
-- Nurse user
('nurse@hospital.com', crypt('password123', gen_salt('bf')), 'Mike Wilson', 'nurse', 'ICU', NULL, NULL, true, true),
-- Radiologist user
('radiologist@hospital.com', crypt('password123', gen_salt('bf')), 'Dr. Emily Davis', 'radiologist', 'Radiology', 'Diagnostic Radiology', 'RAD67890', true, true),
-- Pharmacist user
('pharmacist@hospital.com', crypt('password123', gen_salt('bf')), 'Robert Brown', 'pharmacist', 'Pharmacy', NULL, 'PHARM54321', true, true),
-- Accountant user
('accountant@hospital.com', crypt('password123', gen_salt('bf')), 'Lisa Anderson', 'accountant', 'Finance', NULL, NULL, true, true)
ON CONFLICT (email) DO NOTHING;

-- Add some sample rooms for testing
INSERT INTO rooms (room_number, room_type, floor_number, capacity, available_beds, status, daily_rate)
VALUES 
('101', 'general', 1, 2, 2, 'available', 150.00),
('102', 'general', 1, 2, 1, 'available', 150.00),
('201', 'semi-private', 2, 1, 1, 'available', 250.00),
('202', 'private', 2, 1, 1, 'available', 400.00),
('301', 'icu', 3, 1, 1, 'available', 800.00),
('302', 'icu-hd', 3, 1, 1, 'available', 1200.00)
ON CONFLICT (room_number) DO NOTHING;

-- Add some sample medicines for testing
INSERT INTO medicines (medicine_name, generic_name, manufacturer, quantity_in_stock, unit_price, reorder_level)
VALUES 
('Paracetamol 500mg', 'Acetaminophen', 'PharmaCorp', 100, 2.50, 20),
('Ibuprofen 400mg', 'Ibuprofen', 'MediLabs', 75, 3.00, 15),
('Amoxicillin 250mg', 'Amoxicillin', 'AntibioTech', 50, 5.00, 10),
('Aspirin 100mg', 'Acetylsalicylic acid', 'CardioMed', 80, 1.50, 25),
('Insulin Glargine', 'Insulin glargine', 'DiabCare', 30, 25.00, 5)
ON CONFLICT DO NOTHING;
