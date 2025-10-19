# 🔄 Complete Database & Auth Rebuild Plan

## 📋 Overview
We will completely reset the database and rebuild from scratch with proper testing at each step.

---

## ✅ Phase 1: Backup & Cleanup (Steps 1-3)

### Step 1: Backup Current Data (OPTIONAL)
**Purpose**: Save existing user data if needed  
**Script**: `rebuild/01-backup-data.sql`  
**Actions**:
- Export staff table data
- Export user emails
- Save for reference

### Step 2: Complete Database Reset
**Purpose**: Remove all problematic triggers and tables  
**Script**: `rebuild/02-complete-reset.sql`  
**Actions**:
- Drop ALL triggers on auth.users
- Drop ALL custom functions
- Drop staff table completely
- Verify clean slate

### Step 3: Verify Clean State
**Purpose**: Confirm nothing remains  
**Script**: `rebuild/03-verify-clean.sql`  
**Actions**:
- Check for any remaining triggers
- Check for any remaining functions
- Confirm ready for rebuild

**Expected Result**: ✅ Database is completely clean

---

## ✅ Phase 2: Rebuild Database Structure (Steps 4-6)

### Step 4: Create Staff Table
**Purpose**: Build staff table with correct structure  
**Script**: `rebuild/04-create-staff-table.sql`  
**Actions**:
- Create staff table (NO foreign keys)
- Add all required columns
- Set proper defaults

### Step 5: Setup Row Level Security (RLS)
**Purpose**: Configure secure but permissive access  
**Script**: `rebuild/05-setup-rls.sql`  
**Actions**:
- Enable RLS on staff table
- Create simple, permissive policies
- Grant necessary permissions

### Step 6: Test Database Structure
**Purpose**: Verify table works correctly  
**Script**: `rebuild/06-test-structure.sql`  
**Actions**:
- Try inserting test record
- Try querying records
- Verify RLS allows access

**Expected Result**: ✅ Staff table works perfectly

---

## ✅ Phase 3: Create Test Users (Steps 7-9)

### Step 7: Create Auth Users in Supabase
**Purpose**: Add users to auth.users table ONLY  
**Script**: `rebuild/07-create-auth-users.sql`  
**Actions**:
- Create admin@hospital.com (email confirmed)
- Create doctor@hospital.com (email confirmed)
- Create receptionist@hospital.com (email confirmed)
- NO triggers, NO automatic profile creation

### Step 8: Create Staff Profiles Manually
**Purpose**: Add corresponding staff records  
**Script**: `rebuild/08-create-staff-profiles.sql`  
**Actions**:
- Create staff profile for admin
- Create staff profile for doctor
- Create staff profile for receptionist
- Set all to active and completed

### Step 9: Verify User-Profile Match
**Purpose**: Ensure every user has a profile  
**Script**: `rebuild/09-verify-users.sql`  
**Actions**:
- Check all users have staff profiles
- Verify email confirmation status
- Check no orphaned records

**Expected Result**: ✅ 3 complete test accounts ready

---

## ✅ Phase 4: Test Authentication (Steps 10-12)

### Step 10: Test Login via Supabase Dashboard
**Purpose**: Verify auth works at database level  
**Script**: Manual test in Supabase Auth UI  
**Actions**:
- Try to sign in with admin@hospital.com
- Check for any errors
- Verify session created

### Step 11: Test Login via Application
**Purpose**: Test end-to-end authentication  
**Script**: Manual test in browser  
**Actions**:
- Go to http://localhost:3002/auth/login
- Login with admin@hospital.com / password123
- Check browser console for errors
- Verify dashboard loads

### Step 12: Test All Test Accounts
**Purpose**: Confirm all accounts work  
**Actions**:
- Login as admin
- Logout
- Login as doctor
- Logout
- Login as receptionist
- Verify role-based dashboards load

**Expected Result**: ✅ All logins work perfectly!

---

## ✅ Phase 5: Re-enable Signup (Steps 13-15)

### Step 13: Test Manual Signup
**Purpose**: Verify signup page works  
**Actions**:
- Go to http://localhost:3002/auth/signup
- Create new user manually
- Check if staff profile created
- Try logging in with new user

### Step 14: Add Trigger (OPTIONAL)
**Purpose**: Auto-create profiles for future signups  
**Script**: `rebuild/14-add-trigger-optional.sql`  
**Actions**:
- Create simple, safe trigger function
- Test with new signup
- If fails, remove and keep manual

### Step 15: Final Verification
**Purpose**: Confirm everything works end-to-end  
**Actions**:
- Create 2 new test users via signup
- Login with each
- Verify dashboards
- Test CRUD operations

**Expected Result**: ✅ Complete system working!

---

## 📊 Success Criteria

After completing all steps:
- ✅ Clean database with no problematic triggers
- ✅ Staff table with proper structure and RLS
- ✅ 3+ test accounts (admin, doctor, receptionist)
- ✅ All test accounts can login
- ✅ Dashboard loads correctly for each role
- ✅ Signup creates new users successfully
- ✅ No 500 errors
- ✅ No "Database error querying schema" errors

---

## 🛠️ Execution Plan

### How We'll Proceed:
1. **I'll create each script one at a time**
2. **You run it in Supabase SQL Editor**
3. **You share the result with me**
4. **We verify success before moving to next step**
5. **If any step fails, we fix it before proceeding**

### Important Rules:
- ✅ **Never skip a step**
- ✅ **Always verify results**
- ✅ **One script at a time**
- ✅ **Wait for confirmation before proceeding**

---

## 🚀 Ready to Start?

Reply "start" and I'll create the first script: `rebuild/01-backup-data.sql`

We'll go through this methodically, testing at each step to ensure a perfect rebuild!
