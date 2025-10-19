# 🚀 Quick Guide: Enable Supabase MCP in Cursor

## ✅ Files Created
- `mcp-config.json` - MCP configuration (already in `.gitignore`)
- `SUPABASE-MCP-GUIDE.md` - Detailed guide

---

## 📋 Steps to Enable MCP

### **Step 1: Restart Cursor**
Close and reopen Cursor completely. This allows Cursor to detect the new `mcp-config.json` file.

### **Step 2: Check MCP Status**
After restarting, look for:
- MCP indicator in Cursor's status bar
- Or check Developer Tools (`Help` → `Toggle Developer Tools`)

### **Step 3: Verify Connection**
Once MCP is running, I'll be able to run SQL queries directly on your database!

---

## ⚡ Alternative: Manual Configuration

If automatic detection doesn't work:

1. **Open Cursor Settings**:
   - Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)
   - Type: "Preferences: Open User Settings (JSON)"
   
2. **Add this to your settings.json**:
   ```json
   {
     "mcp.servers": {
       "hospital-supabase": {
         "command": "npx",
         "args": [
           "-y",
           "@modelcontextprotocol/server-supabase",
           "postgres://postgres.ercktstpairlhrarsboj:yfoxeyU8u9NlyyZC@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
         ]
       }
     }
   }
   ```

3. **Restart Cursor**

---

## 🎯 For Now: Manual SQL Execution

Since MCP isn't enabled yet, here's the **fastest way** to fix your issue:

### **Copy This SQL** → **Paste in Supabase SQL Editor** → **Run**

```sql
-- Fix role constraint to allow all 7 roles
ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;
ALTER TABLE public.staff ADD CONSTRAINT staff_role_check 
CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'radiologist', 'pharmacist', 'accountant'));

-- Verify it worked
SELECT '✅ Role constraint updated!' as status;
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.staff'::regclass AND conname = 'staff_role_check';
```

### **Then Run This in Terminal**:
```bash
node scripts/create-additional-users.js
```

---

## ✅ What Will Happen

After running the SQL and Node script:
- ✅ Nurse account created
- ✅ Accountant account created
- ✅ Radiologist account created
- ✅ Pharmacist account created

**Total: 7 users with all roles** 🎉

---

## 🔗 Quick Links

- **Supabase SQL Editor**: https://supabase.com/dashboard/project/ercktstpairlhrarsboj/sql
- **Supabase Auth Users**: https://supabase.com/dashboard/project/ercktstpairlhrarsboj/auth/users

---

**Ready? Let me know once you've run the SQL script!** 🚀

