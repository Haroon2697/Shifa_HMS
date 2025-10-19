// Fix role constraint using Supabase Admin API
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function fixRoleConstraint() {
  console.log('🔧 Attempting to fix role constraint via Supabase API...\n');

  try {
    // Note: The Supabase JS client cannot execute DDL commands (ALTER TABLE)
    // We need to use raw SQL execution which requires the SQL API
    
    console.log('⚠️  IMPORTANT: The Supabase JS client cannot modify table constraints.');
    console.log('');
    console.log('❌ Cannot fix constraint automatically via API.');
    console.log('✅ You must run the SQL manually in Supabase Dashboard.');
    console.log('');
    console.log('📋 Please run this SQL in Supabase SQL Editor:');
    console.log('🔗 https://supabase.com/dashboard/project/ercktstpairlhrarsboj/sql/new\n');
    console.log('─────────────────────────────────────────────────────────────');
    console.log('ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;');
    console.log('ALTER TABLE public.staff ADD CONSTRAINT staff_role_check');
    console.log("CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'radiologist', 'pharmacist', 'accountant'));");
    console.log('─────────────────────────────────────────────────────────────\n');
    
    console.log('Or use the file: FIX-NOW.sql\n');
    
    process.exit(1);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixRoleConstraint();

