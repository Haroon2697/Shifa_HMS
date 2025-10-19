# Supabase MCP Setup Guide

This guide will help you set up the Supabase MCP (Model Context Protocol) server to connect to your hospital management system project.

## Prerequisites

- Node.js installed
- Your Supabase project credentials
- Access to your Supabase project URL and keys

## Installation Steps

### 1. Install Supabase MCP Server

```bash
npm install -g @modelcontextprotocol/server-supabase
```

Or if you prefer using npx (no global installation):
```bash
npx @modelcontextprotocol/server-supabase
```

### 2. Configure MCP for Your Project

Create a configuration file `.mcp-config.json` in your project root:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase",
        "postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
      ]
    }
  }
}
```

### 3. Get Your Supabase Connection String

#### Option A: From Supabase Dashboard
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ercktstpairlhrarsboj`
3. Navigate to: **Settings → Database**
4. Look for **Connection String** section
5. Copy the **Connection Pooling** string (Transaction mode)
6. It should look like:
   ```
   postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

#### Option B: Construct It Manually
Your connection string format:
```
postgres://postgres.ercktstpairlhrarsboj:[YOUR_DB_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

Replace `[YOUR_DB_PASSWORD]` with your actual database password.

### 4. Alternative: Use Environment Variables

Create or update `.env.local`:

```env
# Existing Supabase config
NEXT_PUBLIC_SUPABASE_URL=https://ercktstpairlhrarsboj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# MCP Supabase Connection
SUPABASE_CONNECTION_STRING=postgres://postgres.ercktstpairlhrarsboj:[YOUR_DB_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### 5. Create MCP Config File

Create `mcp-config.json` in your project root:

```json
{
  "mcpServers": {
    "hospital-supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-supabase"
      ],
      "env": {
        "SUPABASE_URL": "https://ercktstpairlhrarsboj.supabase.co",
        "SUPABASE_CONNECTION_STRING": "${SUPABASE_CONNECTION_STRING}"
      }
    }
  }
}
```

### 6. For Cursor IDE Integration

If you're using Cursor IDE, add this to your Cursor settings:

1. Open Cursor Settings (Ctrl/Cmd + ,)
2. Search for "MCP"
3. Add the Supabase MCP server configuration

Or create/update `.cursorrules` file:

```json
{
  "mcp": {
    "servers": {
      "supabase": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-supabase",
          "postgres://postgres.ercktstpairlhrarsboj:[YOUR_DB_PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
        ]
      }
    }
  }
}
```

## Usage

Once configured, the MCP server will provide:

- **Database Schema Access**: Query your database schema
- **SQL Execution**: Run SQL queries directly
- **Table Inspection**: View table structures
- **Data Queries**: Fetch data from your tables

## Verify Connection

To test if MCP is working:

1. Restart your IDE/editor
2. Try using MCP commands to query your database
3. Example: "Show me all tables in my database"
4. Example: "Query the staff table"

## Troubleshooting

### Connection Issues

If you get connection errors:

1. **Check your connection string** - Make sure password is correct
2. **Check firewall/network** - Supabase requires internet connection
3. **Verify pooler is enabled** - Use the connection pooling string, not direct connection

### Permission Issues

If you get permission errors:

1. Check that your database password is correct
2. Ensure your IP is not blocked by Supabase
3. Verify your database user has necessary permissions

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit** `.mcp-config.json` with passwords to Git
2. **Add to .gitignore**:
   ```
   .mcp-config.json
   mcp-config.json
   ```
3. Use environment variables for sensitive data
4. Consider using a `.env.local` file (already in .gitignore)

## Next Steps

After setting up MCP:

1. Test the connection
2. Try querying your database through MCP
3. Use MCP to assist with database operations
4. Continue with fixing the login issue (run `rebuild/17-fix-all-null-columns.sql`)

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Supabase Connection Strings](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Supabase MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/supabase)

