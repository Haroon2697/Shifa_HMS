# 🔌 Supabase MCP Setup Guide

## What is MCP?

**Model Context Protocol (MCP)** allows me (the AI) to directly interact with your Supabase database. This means I can run SQL queries, check database state, and fix issues without you having to copy-paste SQL to the Supabase dashboard!

---

## ✅ MCP Configuration Created

I've created `mcp-config.json` with your Supabase connection string. This file is:
- ✅ Already in `.gitignore` (won't be committed to Git)
- ✅ Contains your database password (keep it secure!)
- ✅ Ready to use

---

## 🚀 How to Enable MCP in Cursor

### Option 1: Automatic (Cursor should detect it)
Cursor should automatically detect the `mcp-config.json` file in your workspace root and enable the Supabase MCP server.

### Option 2: Manual Setup
If Cursor doesn't detect it automatically:

1. **Open Cursor Settings** → `Ctrl+,` (or `Cmd+,` on Mac)
2. **Search for:** "MCP"
3. **Add MCP Server:**
   - Server Name: `hospital-supabase`
   - Command: `npx`
   - Args: `-y @modelcontextprotocol/server-supabase postgres://postgres.ercktstpairlhrarsboj:yfoxeyU8u9NlyyZC@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`

### Option 3: Restart Cursor
Sometimes Cursor needs a restart to pick up the MCP config:
- Close and reopen Cursor
- The MCP server should start automatically

---

## 🔍 How to Check if MCP is Working

Once MCP is enabled, I can:
- ✅ Run SQL queries directly on your database
- ✅ Check table schemas and constraints
- ✅ Create and modify users
- ✅ Verify database state
- ✅ Fix issues without you copying SQL

---

## 🎯 What We Can Do Now

With MCP enabled, I can:

1. **Run the role constraint fix** directly:
   ```sql
   ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;
   ALTER TABLE public.staff ADD CONSTRAINT staff_role_check 
   CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'radiologist', 'pharmacist', 'accountant'));
   ```

2. **Verify the fix** worked:
   ```sql
   SELECT * FROM pg_constraint WHERE conrelid = 'public.staff'::regclass;
   ```

3. **Check existing users**:
   ```sql
   SELECT email, raw_user_meta_data->>'role' as role FROM auth.users;
   ```

---

## ⚠️ Security Notes

- ✅ `mcp-config.json` is in `.gitignore` (won't be pushed to GitHub)
- ✅ Connection string contains database password
- ✅ Only you and I (in this session) can access it
- ⚠️ Don't share this file publicly

---

## 🆘 Troubleshooting

### MCP Not Starting?
1. Check Cursor Developer Tools: `Help` → `Toggle Developer Tools`
2. Look for MCP-related errors in the console
3. Try restarting Cursor

### Still Need Manual SQL?
If MCP doesn't work, you can still:
1. Go to Supabase SQL Editor
2. Copy-paste from `rebuild/19-add-missing-roles.sql`
3. Run manually

---

## 🎉 Next Steps

Once MCP is enabled, just say:
- "Run the role constraint fix"
- "Check if all roles are allowed"
- "Show me existing users"

And I'll do it directly! 🚀

