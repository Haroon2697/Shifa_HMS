#!/usr/bin/env node

/**
 * Fix Role Constraint via Supabase Admin API
 * This script adds all 7 roles to the staff table constraint
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixRoleConstraint() {
  console.log('🔧 Fixing staff table role constraint...\n')

  try {
    // Step 1: Check current constraint
    console.log('📋 Step 1: Checking current constraint...')
    const { data: currentConstraint, error: checkError } = await supabase
      .rpc('exec_sql', {
        query: `
          SELECT 
            conname as constraint_name,
            pg_get_constraintdef(oid) as constraint_definition
          FROM pg_constraint
          WHERE conrelid = 'public.staff'::regclass
            AND contype = 'c'
            AND conname LIKE '%role%';
        `
      })
    
    if (checkError) {
      console.log('⚠️ Could not check constraint (this is ok)')
      console.log('   Error:', checkError.message)
    } else if (currentConstraint) {
      console.log('✅ Current constraint:', JSON.stringify(currentConstraint, null, 2))
    }

    // Step 2: Drop old constraint and add new one
    console.log('\n🔨 Step 2: Updating constraint with all 7 roles...')
    
    const sql = `
      -- Drop old constraint
      ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;
      
      -- Add new constraint with all 7 roles
      ALTER TABLE public.staff ADD CONSTRAINT staff_role_check 
      CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist', 'radiologist', 'pharmacist', 'accountant'));
    `

    const { data, error } = await supabase.rpc('exec_sql', { query: sql })

    if (error) {
      // If RPC doesn't exist, we'll need to use direct SQL connection
      // which isn't available via client API
      console.log('⚠️ Cannot execute DDL via Supabase client API')
      console.log('   This is a Supabase limitation - DDL commands require direct SQL access')
      console.log('\n' + '='.repeat(60))
      console.log('📋 MANUAL ACTION REQUIRED')
      console.log('='.repeat(60))
      console.log('\n🔗 Go to: https://supabase.com/dashboard/project/ercktstpairlhrarsboj/sql/new')
      console.log('\n📝 Paste and run this SQL:\n')
      console.log(sql)
      console.log('\n✅ After running the SQL, come back and run:')
      console.log('   node scripts/force-create-users.js')
      console.log('\n' + '='.repeat(60))
      return false
    }

    console.log('✅ Constraint updated successfully!')

    // Step 3: Verify new constraint
    console.log('\n🔍 Step 3: Verifying new constraint...')
    const { data: newConstraint, error: verifyError } = await supabase
      .rpc('exec_sql', {
        query: `
          SELECT 
            conname as constraint_name,
            pg_get_constraintdef(oid) as constraint_definition
          FROM pg_constraint
          WHERE conrelid = 'public.staff'::regclass
            AND contype = 'c'
            AND conname = 'staff_role_check';
        `
      })

    if (verifyError) {
      console.log('⚠️ Could not verify constraint')
    } else {
      console.log('✅ New constraint:', JSON.stringify(newConstraint, null, 2))
    }

    console.log('\n' + '='.repeat(60))
    console.log('🎉 SUCCESS! Role constraint fixed!')
    console.log('='.repeat(60))
    console.log('\n✅ All 7 roles are now allowed:')
    console.log('   • admin')
    console.log('   • doctor')
    console.log('   • nurse')
    console.log('   • receptionist')
    console.log('   • radiologist')
    console.log('   • pharmacist')
    console.log('   • accountant')
    console.log('\n🚀 Next: Run node scripts/force-create-users.js')
    console.log('='.repeat(60) + '\n')

    return true

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message)
    console.error('\n📋 Please run the SQL manually:')
    console.error('   https://supabase.com/dashboard/project/ercktstpairlhrarsboj/sql/new')
    return false
  }
}

// Run the fix
fixRoleConstraint().then(success => {
  process.exit(success ? 0 : 1)
})
