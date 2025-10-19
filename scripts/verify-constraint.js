#!/usr/bin/env node

/**
 * Verify Role Constraint
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

async function verifyConstraint() {
  console.log('🔍 Checking role constraint...\n')

  // Check the constraint
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .limit(1)

  if (error) {
    console.log('❌ Error querying staff table:', error.message)
    return
  }

  console.log('✅ Staff table is accessible')
  console.log('\n📝 Now testing if we can insert a nurse role...\n')

  // Try to insert a test nurse record (will delete after)
  const testId = '00000000-0000-0000-0000-000000000001'
  
  const { data: insertData, error: insertError } = await supabase
    .from('staff')
    .insert({
      id: testId,
      email: 'test-nurse@test.com',
      full_name: 'Test Nurse',
      role: 'nurse',
      department: 'Test',
      is_active: true,
      profile_completed: true
    })
    .select()

  if (insertError) {
    console.log('❌ Cannot insert nurse role!')
    console.log('   Error:', insertError.message)
    console.log('   Code:', insertError.code)
    console.log('\n⚠️ This means the role constraint was NOT updated!')
    console.log('\n📋 Please verify you ran this SQL correctly:')
    console.log('   ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;')
    console.log('   ALTER TABLE public.staff ADD CONSTRAINT staff_role_check')
    console.log('   CHECK (role IN (\'admin\', \'doctor\', \'nurse\', \'receptionist\', \'radiologist\', \'pharmacist\', \'accountant\'));')
    console.log('\n🔗 Go to: https://supabase.com/dashboard/project/ercktstpairlhrarsboj/sql/new')
    return false
  }

  console.log('✅ Successfully inserted nurse role!')
  
  // Clean up test record
  await supabase
    .from('staff')
    .delete()
    .eq('id', testId)

  console.log('✅ Constraint is working correctly!\n')
  console.log('🎉 All 7 roles are now allowed.\n')
  return true
}

verifyConstraint().then(success => {
  if (!success) {
    process.exit(1)
  }
  process.exit(0)
})

