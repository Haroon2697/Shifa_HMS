#!/usr/bin/env node

/**
 * Check for any triggers or hooks that might be interfering
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkDatabase() {
  console.log('🔍 Checking for triggers and functions...\n')

  // This requires executing raw SQL, which we can't do via client
  // But we can check the Supabase dashboard

  console.log('⚠️ Cannot check triggers via API')
  console.log('\n📋 Please run this SQL in Supabase SQL Editor:')
  console.log('   https://supabase.com/dashboard/project/ercktstpairlhrarsboj/sql/new\n')
  
  const checkSQL = `
-- Check for triggers on auth.users
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgrelid = 'auth.users'::regclass
  AND tgname NOT LIKE 'pg_%';

-- Check for functions that might interfere
SELECT 
  proname as function_name,
  pg_get_functiondef(oid) as definition
FROM pg_proc
WHERE proname LIKE '%user%'
  AND pronamespace = 'public'::regnamespace;
`

  console.log(checkSQL)
  console.log('\n' + '='.repeat(60))
  console.log('Expected: No triggers should be returned')
  console.log('If you see triggers: We need to drop them')
  console.log('='.repeat(60) + '\n')
}

checkDatabase().then(() => process.exit(0))

