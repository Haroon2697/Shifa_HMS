# MCP Connection Test

## Status: Configuration Found ✅

Your `mcp.json` file at `c:\Users\haroo\.cursor\mcp.json` contains the correct configuration:

```json
{
  "mcpServers": {
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

## Issue: MCP Server Not Starting

The configuration is correct, but the MCP server isn't responding yet.

## 🔧 Solutions to Try:

### 1. **Completely Restart Cursor**
   - Close ALL Cursor windows
   - Wait 5 seconds
   - Open Cursor again
   - Open this project

### 2. **Check Developer Console**
   - In Cursor: `Help` → `Toggle Developer Tools`
   - Look for any errors related to MCP or `@modelcontextprotocol/server-supabase`
   - Check if you see connection attempts

### 3. **Install MCP Server Manually** (if needed)
   ```bash
   npm install -g @modelcontextprotocol/server-supabase
   ```

### 4. **Test Connection Manually**
   ```bash
   npx -y @modelcontextprotocol/server-supabase "postgres://postgres.ercktstpairlhrarsboj:yfoxeyU8u9NlyyZC@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
   ```

## ⚡ Quick Alternative: Direct SQL

While we troubleshoot MCP, you can run the SQL fix directly:

### **Go to Supabase SQL Editor:**
https://supabase.com/dashboard/project/ercktstpairlhrarsboj/sql

### **Run this SQL:**
```sql
ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;
ALTER TABLE public.staff ADD CONSTRAINT staff_role_check 
CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'radiologist', 'pharmacist', 'accountant'));
SELECT '✅ Roles updated!' as status;
```

### **Then run in terminal:**
```bash
node scripts/create-additional-users.js
```

This will immediately fix your issue while we troubleshoot MCP! 🚀

---

**Which approach do you want to try first?**
- A) Restart Cursor completely
- B) Run the SQL manually in Supabase (fastest)
- C) Check Developer Console for errors

