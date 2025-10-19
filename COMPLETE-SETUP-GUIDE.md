# 🏥 Hospital Management System - Complete Setup Guide

**Project Status:** ✅ OPERATIONAL  
**Last Updated:** After successful authentication fix  
**All 7 User Roles:** Working and tested

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [User Credentials](#user-credentials)
3. [Database Schema](#database-schema)
4. [Troubleshooting](#troubleshooting)
5. [Development](#development)
6. [Deployment](#deployment)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/Haroon2697/Shifa_HMS.git
cd hospital-management-system

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Visit: http://localhost:3000 (or 3001 if 3000 is busy)

---

## 👥 User Credentials

### All Test Users

**Password for all users:** `password123`

| Role | Email | Name | Department |
|------|-------|------|------------|
| Admin | `admin@hospital.com` | System Administrator | Administration |
| Doctor | `doctor@hospital.com` | Dr. Sarah Johnson | General Medicine |
| Receptionist | `receptionist@hospital.com` | Jane Smith | Front Desk |
| Nurse | `nurse@hospital.com` | Jessica Martinez | General Ward |
| Accountant | `accountant@hospital.com` | Michael Brown | Finance |
| Radiologist | `radiologist@hospital.com` | Dr. Robert Wilson | Radiology |
| Pharmacist | `pharmacist@hospital.com` | Lisa Anderson | Pharmacy |

### Role-Specific Features

**Admin:**
- User management
- System settings
- Full access to all modules

**Doctor:**
- Patient consultations
- OPD management
- Prescription management
- OT scheduling

**Nurse:**
- Patient care
- Ward management
- Vital signs tracking

**Receptionist:**
- Patient registration
- Appointment scheduling
- Front desk operations

**Accountant:**
- Billing management
- Financial reports
- Payment tracking

**Radiologist:**
- Radiology tests
- Image management
- Test reports

**Pharmacist:**
- Pharmacy management
- Medicine inventory
- Prescription fulfillment

---

## 🗄️ Database Schema

### Core Tables

#### `public.staff`
Main staff/user table linked to `auth.users`

```sql
- id (uuid, PK, references auth.users.id)
- email (varchar, unique)
- full_name (varchar)
- role (enum: admin, doctor, nurse, receptionist, radiologist, pharmacist, accountant)
- department (varchar)
- phone (varchar)
- specialization (varchar, nullable)
- license_number (varchar, nullable)
- is_active (boolean)
- profile_completed (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Row Level Security (RLS)

```sql
-- Staff table policies
- Authenticated users can view all staff
- Users can view/edit their own profile
- Service role has full access
```

### Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid login credentials"

**Cause:** Password hashing mismatch  
**Solution:** Users must be created via Supabase Admin API, not direct SQL

```bash
# Recreate users with proper passwords
node scripts/recreate-4-users-with-correct-passwords.js
```

#### 2. "Database error creating new user" (500 error)

**Cause:** Role constraint mismatch  
**Solution:** Update staff table constraint

```sql
ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;
ALTER TABLE public.staff ADD CONSTRAINT staff_role_check 
CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'radiologist', 'pharmacist', 'accountant'));
```

#### 3. User exists in auth.users but not in staff table

**Solution:** Run the profile creation script

```bash
node scripts/create-missing-staff-profiles.js
```

#### 4. Port 3000 already in use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or run on different port
npm run dev -- -p 3001
```

#### 5. Email confirmation required

**Solution:** Disable in Supabase Dashboard
1. Go to: Authentication → Providers → Email
2. Uncheck "Confirm email"
3. Save

---

## 💻 Development

### Project Structure

```
hospital-management-system/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # UI components
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   └── auth-context.tsx  # Auth context
├── scripts/              # Utility scripts
│   ├── create-users.js   # User creation
│   └── verify-all-7-users.js  # Verification
└── rebuild/              # Database rebuild scripts
```

### Key Files

**Authentication:**
- `lib/auth-context.tsx` - Auth provider and hooks
- `lib/supabase/client.ts` - Supabase client
- `app/auth/login/page.tsx` - Login page

**Dashboard:**
- `components/dashboard/dashboard.tsx` - Main dashboard
- `components/dashboard/roles/*.tsx` - Role-specific dashboards

### Adding New Users

**Method 1: Via Signup Page**
1. Go to `/auth/signup`
2. Fill in details
3. User created automatically

**Method 2: Via Node.js Script**

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(url, serviceRoleKey)

await supabase.auth.admin.createUser({
  email: 'user@example.com',
  password: 'password123',
  email_confirm: true,
  user_metadata: {
    full_name: 'User Name',
    role: 'doctor'
  }
})

// Then create staff profile
await supabase.from('staff').insert({
  id: userId,
  email: 'user@example.com',
  full_name: 'User Name',
  role: 'doctor',
  department: 'Department',
  is_active: true,
  profile_completed: true
})
```

### Database Scripts

Located in `rebuild/` directory:

- `04-create-staff-table.sql` - Creates staff table
- `05-setup-rls.sql` - Sets up Row Level Security
- `19-add-missing-roles.sql` - Updates role constraints

---

## 🚀 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod
```

### Environment Variables for Production

Required in deployment platform:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (for server-side operations)
```

---

## 📚 Additional Resources

### Supabase Dashboard Links

- **Project Dashboard:** https://supabase.com/dashboard/project/ercktstpairlhrarsboj
- **SQL Editor:** https://supabase.com/dashboard/project/ercktstpairlhrarsboj/sql/new
- **Auth Settings:** https://supabase.com/dashboard/project/ercktstpairlhrarsboj/auth/providers
- **Database Tables:** https://supabase.com/dashboard/project/ercktstpairlhrarsboj/editor

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🔐 Security Notes

### Important Security Considerations

1. **Never commit `.env.local`** - Contains sensitive keys
2. **Use RLS policies** - Protect database access
3. **Validate user roles** - Server-side validation
4. **Secure service role key** - Only use server-side
5. **Enable MFA** - For admin users in production

### RLS Best Practices

```sql
-- Example: Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON public.staff
FOR UPDATE
USING (auth.uid() = id);
```

---

## 🐛 Known Issues & Solutions

### Issue: Users Missing Staff Profiles

**Symptoms:** User exists in auth.users but can't access dashboard

**Diagnosis:**
```sql
-- Check for mismatches
SELECT 
  (SELECT COUNT(*) FROM auth.users) as auth_count,
  (SELECT COUNT(*) FROM public.staff) as staff_count;
```

**Solution:**
```bash
node scripts/create-missing-staff-profiles.js
```

### Issue: Password Hash Incompatibility

**Symptoms:** "Invalid login credentials" for specific users

**Cause:** Users created via SQL crypt() instead of Admin API

**Solution:**
1. Delete problematic auth users (keep staff profiles)
2. Recreate via Admin API:
```bash
node scripts/recreate-4-users-with-correct-passwords.js
```

---

## 📞 Support

### Getting Help

1. **Check this guide first** - Most issues covered here
2. **Review error logs** - Check browser console and server logs
3. **Supabase logs** - Check Auth Logs in dashboard
4. **GitHub Issues** - Report bugs on GitHub repository

---

## ✅ Setup Checklist

Use this checklist when setting up the system:

- [ ] Clone repository
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env.local` with Supabase credentials
- [ ] Disable email confirmation in Supabase
- [ ] Run database migrations (if needed)
- [ ] Verify all 7 users exist and work
- [ ] Test login for each role
- [ ] Test role-specific dashboards
- [ ] Configure production environment variables
- [ ] Deploy to hosting platform

---

## 🎉 Success Indicators

Your system is working correctly when:

- ✅ All 7 users can login
- ✅ Each role sees their specific dashboard
- ✅ No authentication errors in console
- ✅ Staff profiles load correctly
- ✅ Database queries work without permission errors

---

## 📝 Change Log

### Latest Changes

**Authentication Fix (Latest):**
- Fixed password hashing for 4 users (nurse, accountant, radiologist, pharmacist)
- All users now use Supabase Admin API for proper password handling
- Consolidated documentation into single guide

**Database Schema:**
- Added all 7 roles to staff table constraint
- Implemented RLS policies
- Created staff table with proper structure

**User Management:**
- Created 7 test users across all roles
- Automated user creation scripts
- Profile completion automation

---

**System Status:** 🟢 FULLY OPERATIONAL

All 7 user roles working • Authentication fixed • Ready for production

---

*For questions or issues, refer to the Troubleshooting section or check Supabase Auth Logs.*

