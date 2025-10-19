# 🏥 Hospital Management System - Setup Instructions

## Current Issue: "Invalid login credentials"

The authentication system is working perfectly! The error means you need to create test users in your Supabase database.

---

## 🚀 Quick Fix (5 minutes)

### Step 1: Disable Email Confirmation (IMPORTANT!)
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **ercktstpairlhrarsboj**
3. Go to **Authentication** → **Providers** → **Email**
4. Find **"Confirm email"** toggle and **turn it OFF**
5. Click **Save**

This allows test users to login without email verification.

### Step 2: Open Supabase SQL Editor
1. Click **SQL Editor** in the left sidebar
2. Click **New Query**

### Step 3: Run the Quick Setup Script
1. Copy and paste the entire contents of `scripts/QUICK-SETUP.sql`
2. Click **Run** (or press Ctrl+Enter)

This script will:
- ✅ Create the `staff` table if it doesn't exist
- ✅ Set up Row Level Security (RLS) policies
- ✅ Create a trigger to auto-create staff profiles on signup
- ✅ Create 4 test users with **pre-confirmed emails** and passwords
- ✅ Remove any unverified test accounts

### Step 3b (Optional): If You Already Have Unverified Users
If you already created test users but they're not verified, run this:
1. Copy and paste the contents of `scripts/CONFIRM-EXISTING-USERS.sql`
2. Click **Run**
3. This will confirm all existing test users

### Step 4: Test Login
Open your app at http://localhost:3002/auth/login and try these credentials:

| Email | Password | Role |
|-------|----------|------|
| admin@hospital.com | password123 | Administrator |
| doctor@hospital.com | password123 | Doctor |
| receptionist@hospital.com | password123 | Receptionist |
| accountant@hospital.com | password123 | Accountant |

---

## 🎯 Alternative: Create Your Own User

### Option A: Use the Signup Page
1. Go to http://localhost:3002/auth/signup
2. Fill in your details:
   - **Full Name**: Your Name
   - **Email**: your@email.com
   - **Phone**: +1 (555) 123-4567
   - **Role**: Select any role (e.g., Accountant)
   - **Department**: e.g., Finance
   - **Password**: YourPassword123
   - **Confirm Password**: YourPassword123
3. Click **Sign Up**
4. You can now login with your credentials!

### Option B: Manually Create User in Supabase
1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User**
3. Enter:
   - Email: your@email.com
   - Password: YourPassword123
   - Auto Confirm User: ✅ Yes
4. Click **Create User**
5. Go to **SQL Editor** and run:
```sql
-- Replace 'USER_ID' with the actual UUID from the users table
-- Replace 'your@email.com' with your actual email
INSERT INTO public.staff (id, email, full_name, role, department, is_active)
SELECT id, email, 'Your Name', 'accountant', 'Finance', true
FROM auth.users
WHERE email = 'your@email.com';
```

---

## 🔧 What Was Fixed

### 1. Authentication Context Updated
The authentication system now properly connects to Supabase instead of using mock data:
- ✅ Real authentication with Supabase
- ✅ Automatic session management
- ✅ Staff profile loading
- ✅ Role-based access control

### 2. Signup Page Enhanced
The signup page now creates staff profiles automatically, even if the database trigger isn't set up:
- ✅ Creates auth user in Supabase
- ✅ Creates staff profile with role and department
- ✅ Handles both trigger and manual profile creation

### 3. Database Schema
The quick setup script ensures:
- ✅ Staff table with all required columns
- ✅ Row Level Security (RLS) policies
- ✅ Automatic profile creation trigger
- ✅ Test users for all roles

---

## 📋 Verify Everything Works

### Test Checklist:
- [ ] Can login with test user (admin@hospital.com / password123)
- [ ] Redirects to dashboard after login
- [ ] Dashboard shows correct role and name
- [ ] Can navigate between different modules
- [ ] Can create new user via signup page
- [ ] New user can login successfully

---

## ❓ Troubleshooting

### "Invalid login credentials" persists
**Solution**: Make sure you ran the QUICK-SETUP.sql script in Supabase SQL Editor

### "User profile not found"
**Solution**: Run this in SQL Editor:
```sql
-- Check if staff profile exists
SELECT * FROM public.staff WHERE email = 'your@email.com';

-- If no results, create the profile:
INSERT INTO public.staff (id, email, full_name, role, department, is_active)
SELECT id, email, 'Your Name', 'admin', 'Administration', true
FROM auth.users
WHERE email = 'your@email.com'
ON CONFLICT (id) DO NOTHING;
```

### "RLS policy violation"
**Solution**: Make sure the RLS policies were created by the QUICK-SETUP.sql script

### Can't see SQL Editor in Supabase
**Solution**: Make sure you're logged into the correct Supabase project

---

## 🎉 Next Steps

Once you can login successfully:
1. **Explore the Dashboard** - Each role has a different view
2. **Create Sample Patients** - Use the Patient Management module
3. **Schedule Appointments** - Try the Appointment Management
4. **Test Other Roles** - Login as doctor, receptionist, etc.

---

## 📞 Still Having Issues?

If you're still experiencing problems:
1. Check the browser console for error messages (F12)
2. Verify your Supabase credentials in `.env.local`
3. Make sure the Supabase project is active and not paused
4. Check if you have any browser extensions blocking cookies/storage

The authentication system is now fully functional and ready to use! 🚀
