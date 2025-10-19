# 🔍 SUPABASE DASHBOARD CHECKLIST

The login is still failing with "Database error querying schema". This error typically comes from **Supabase Dashboard settings**, not SQL.

## ✅ MANUAL CHECKS IN SUPABASE DASHBOARD

Please check these settings in your Supabase Dashboard:

### 1️⃣ **Database → Webhooks**
- Go to: `https://supabase.com/dashboard/project/ercktstpairlhrarsboj/database/webhooks`
- **Check if there are ANY webhooks enabled**
- **If you see any webhooks, DISABLE or DELETE them**
- Especially look for webhooks triggered on `auth.users` table

### 2️⃣ **Database → Extensions**
- Go to: `https://supabase.com/dashboard/project/ercktstpairlhrarsboj/database/extensions`
- Check if any unusual extensions are enabled
- Common safe extensions: `uuid-ossp`, `pgcrypto`, `pg_stat_statements`
- If you see `supabase_hooks` or similar, it might be causing issues

### 3️⃣ **Authentication → Settings**
- Go to: `https://supabase.com/dashboard/project/ercktstpairlhrarsboj/settings/auth`
- Scroll to **"Auth Hooks"** section
- **Check if any hooks are enabled** (like "Send Email Hook", "Custom Access Token Hook", etc.)
- **DISABLE ALL AUTH HOOKS temporarily** to test

### 4️⃣ **Edge Functions**
- Go to: `https://supabase.com/dashboard/project/ercktstpairlhrarsboj/functions`
- Check if there are any Edge Functions deployed
- If any are related to auth, disable them temporarily

### 5️⃣ **Database → Logs**
- Go to: `https://supabase.com/dashboard/project/ercktstpairlhrarsboj/logs/postgres-logs`
- **Filter logs by time** (last 15 minutes)
- **Look for the actual error message** when you try to login
- Share the error log here - it will tell us exactly what's failing

---

## 🎯 AFTER CHECKING DASHBOARD

Once you've checked these settings, please share:

1. ✅ **Are there any webhooks enabled?** (yes/no)
2. ✅ **Are there any auth hooks enabled?** (yes/no)
3. ✅ **Are there any edge functions?** (yes/no)
4. ✅ **What does the database log say?** (copy the error from logs)

---

## 📝 OR: Run the diagnostic script

Run `rebuild/11-check-supabase-hooks.sql` in Supabase SQL Editor and share the output.

This will help us find hidden triggers or functions causing the issue.

