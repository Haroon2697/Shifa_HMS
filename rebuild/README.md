# Hospital Management System - Database Rebuild Scripts

This directory contains the complete database rebuild sequence that was used to fix authentication and setup issues.

## 📋 Complete Rebuild Sequence

Run these scripts **in order** in the Supabase SQL Editor:

### Phase 1: Database Reset
1. ✅ `01-backup-data.sql` - Backup existing data (optional)
2. ✅ `02-complete-reset.sql` - Remove all triggers, functions, and staff table
3. ✅ `03-verify-clean.sql` - Verify database is clean

### Phase 2: Database Structure
4. ✅ `04-create-staff-table.sql` - Create staff table with proper schema
5. ✅ `05-setup-rls.sql` - Setup Row Level Security
6. ✅ `06-test-structure.sql` - Test database operations

### Phase 3: User Creation (SKIP - Use Node.js script instead)
7. ⚠️ `07-create-auth-users.sql` - **DEPRECATED** - Creates users with wrong password hashing
8. ⚠️ `08-create-staff-profiles.sql` - **DEPRECATED** - Use after Step 7

### Phase 4: Testing & Diagnostics
9. ✅ `09-test-database-login.sql` - Test database structure
10. ✅ `10-final-cleanup.sql` - Remove any remaining triggers
11. ✅ `11-check-supabase-hooks.sql` - Check for webhooks and hooks
12. ✅ `12-find-and-fix-array-agg.sql` - Find functions with array_agg
13. ✅ `13-simple-diagnostic.sql` - Simple diagnostic checks

### Phase 5: Fixing NULL Token Issues
14. ✅ `14-fix-confirmation-token.sql` - Fix confirmation_token NULL errors
15. ✅ `15-fix-tokens-with-function.sql` - Fix tokens using privileged function
16. ✅ `16-check-token-fix.sql` - Verify token fix
17. ✅ `17-fix-all-null-columns.sql` - Fix ALL NULL string columns
18. ✅ `18-delete-and-recreate-users.sql` - Delete invalid test users

### Phase 6: Add Missing Roles
19. ✅ `19-add-missing-roles.sql` - Add nurse, accountant, radiologist, pharmacist roles

---

## 🚀 Recommended Setup Process

### Step 1: Setup Database Structure
```bash
# Run in Supabase SQL Editor in order:
1. 02-complete-reset.sql
2. 03-verify-clean.sql
3. 04-create-staff-table.sql
4. 05-setup-rls.sql
5. 06-test-structure.sql
6. 10-final-cleanup.sql
7. 19-add-missing-roles.sql
```

### Step 2: Create Users with Proper Password Hashing
```bash
# Run in terminal (NOT in SQL Editor):
node scripts/create-users.js
node scripts/create-additional-users.js
```

---

## 👥 Test User Credentials

After running the Node.js scripts, you'll have these users:

### Core Staff (from create-users.js)
- **Admin:** admin@hospital.com / password123
- **Doctor:** doctor@hospital.com / password123
- **Receptionist:** receptionist@hospital.com / password123

### Additional Staff (from create-additional-users.js)
- **Nurse:** nurse@hospital.com / password123
- **Accountant:** accountant@hospital.com / password123
- **Radiologist:** radiologist@hospital.com / password123
- **Pharmacist:** pharmacist@hospital.com / password123

**Total: 7 users across all roles**

---

## ⚠️ Important Notes

### Why NOT use SQL for user creation?
- ❌ SQL `crypt()` function uses wrong password hashing
- ❌ Results in "Invalid login credentials" errors
- ✅ Supabase Admin API uses proper bcrypt hashing
- ✅ Emails are auto-confirmed

### Environment Variables Required
Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Common Issues Solved

1. **500 Error "Database error querying schema"**
   - Fixed by: `10-final-cleanup.sql` (removes triggers)
   - Fixed by: `17-fix-all-null-columns.sql` (fixes NULL tokens)

2. **400 Error "Invalid login credentials"**
   - Fixed by: Using Node.js scripts instead of SQL for user creation

3. **"Database error creating new user"**
   - Fixed by: `19-add-missing-roles.sql` (adds missing role constraints)

---

## 🔄 Quick Reset (If You Need to Start Over)

```bash
# 1. Run in Supabase SQL Editor:
02-complete-reset.sql
03-verify-clean.sql
04-create-staff-table.sql
05-setup-rls.sql
19-add-missing-roles.sql

# 2. Run in terminal:
node scripts/create-users.js
node scripts/create-additional-users.js
```

---

## 📚 Related Documentation

- `../COMPLETE-REBUILD-PLAN.md` - Overall rebuild strategy
- `../SETUP-INSTRUCTIONS.md` - Initial setup guide
- `../LOGIN-CREDENTIALS.md` - Test credentials
- `../scripts/create-users.js` - User creation script
- `../scripts/create-additional-users.js` - Additional users script

---

## ✅ Success Criteria

After running all scripts, you should be able to:
- ✅ Login with all 7 test users
- ✅ Access role-specific dashboards
- ✅ No 500 errors
- ✅ No 400 "Invalid credentials" errors
- ✅ All staff profiles are active and completed

---

## 🆘 Troubleshooting

### Still getting errors?
1. Check Auth Logs: Supabase Dashboard → Logs → Auth Logs
2. Check if all roles are added: Run `19-add-missing-roles.sql`
3. Verify service role key is correct in `.env.local`
4. Re-run: `node scripts/create-users.js`

### Need help?
- Check `../SUPABASE-DASHBOARD-CHECKLIST.md`
- Review Auth Logs in Supabase Dashboard
- Verify all environment variables are set

---

**Last Updated:** After complete rebuild and authentication fix
**Status:** ✅ All authentication issues resolved

