# Environment Variables Template

Copy this to `.env.local` and fill in your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ercktstpairlhrarsboj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Supabase Service Role Key (for admin operations - KEEP SECRET!)
# Get this from: Supabase Dashboard → Settings → API → service_role key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## How to Get Your Keys

### 1. Anon Key (Already have this)
- Go to: https://supabase.com/dashboard/project/ercktstpairlhrarsboj/settings/api
- Copy the **`anon`** **`public`** key

### 2. Service Role Key (IMPORTANT - For creating users)
- Go to: https://supabase.com/dashboard/project/ercktstpairlhrarsboj/settings/api
- Copy the **`service_role`** **`secret`** key
- ⚠️ **NEVER commit this to Git!** It has admin privileges

## Usage

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your keys

3. The file is already in `.gitignore` so it won't be committed

