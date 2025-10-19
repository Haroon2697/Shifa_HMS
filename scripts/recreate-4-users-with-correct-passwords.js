#!/usr/bin/env node

/**
 * Recreate 4 Users with Correct Password Hashing
 * This fixes the "Invalid login credentials" error
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const usersToRecreate = [
  {
    email: 'nurse@hospital.com',
    password: 'password123',
    fullName: 'Jessica Martinez',
    role: 'nurse'
  },
  {
    email: 'accountant@hospital.com',
    password: 'password123',
    fullName: 'Michael Brown',
    role: 'accountant'
  },
  {
    email: 'radiologist@hospital.com',
    password: 'password123',
    fullName: 'Dr. Robert Wilson',
    role: 'radiologist'
  },
  {
    email: 'pharmacist@hospital.com',
    password: 'password123',
    fullName: 'Lisa Anderson',
    role: 'pharmacist'
  }
]

async function recreateUser(userInfo) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Recreating: ${userInfo.email}`)
  console.log('='.repeat(60))

  try {
    // Step 1: Get the existing staff profile
    console.log('Step 1: Getting existing staff profile...')
    const { data: existingStaff, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('email', userInfo.email)
      .single()

    if (staffError || !existingStaff) {
      console.log('❌ No staff profile found for', userInfo.email)
      return false
    }

    console.log('✅ Found existing staff profile')
    const oldUserId = existingStaff.id

    // Step 2: Create new auth user with proper password hashing
    console.log('Step 2: Creating new auth user with proper password...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userInfo.email,
      password: userInfo.password,
      email_confirm: true,
      user_metadata: {
        full_name: userInfo.fullName,
        role: userInfo.role
      }
    })

    if (authError) {
      console.log('❌ Auth creation failed:', authError.message)
      return false
    }

    console.log('✅ Auth user created:', authData.user.id)
    const newUserId = authData.user.id

    // Step 3: Update staff profile with new user ID
    console.log('Step 3: Updating staff profile with new user ID...')
    const { error: updateError } = await supabase
      .from('staff')
      .update({ id: newUserId })
      .eq('id', oldUserId)

    if (updateError) {
      console.log('❌ Failed to update staff profile:', updateError.message)
      console.log('   Attempting to delete orphaned auth user...')
      
      // Clean up the auth user we just created
      await supabase.auth.admin.deleteUser(newUserId)
      return false
    }

    console.log('✅ Staff profile updated successfully')
    console.log(`✅ ${userInfo.email} - COMPLETE!`)
    return true

  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
    return false
  }
}

async function main() {
  console.log('=' .repeat(60))
  console.log('🔧 RECREATING 4 USERS WITH CORRECT PASSWORDS')
  console.log('=' .repeat(60))
  console.log()
  console.log('This will fix the "Invalid login credentials" error')
  console.log('by using Supabase Admin API for proper password hashing.')
  console.log()

  let successCount = 0
  let failCount = 0

  for (const user of usersToRecreate) {
    const success = await recreateUser(user)
    if (success) {
      successCount++
    } else {
      failCount++
    }
    
    // Small delay between users
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n' + '=' .repeat(60))
  console.log('📊 SUMMARY')
  console.log('=' .repeat(60))
  console.log(`✅ Successful: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log('=' .repeat(60))

  if (successCount === 4) {
    console.log('\n🎉 ALL USERS RECREATED SUCCESSFULLY!')
    console.log('\n📝 Test Credentials:')
    usersToRecreate.forEach(u => {
      console.log(`   • ${u.email} / password123`)
    })
    console.log('\n🌐 Test at: http://localhost:3001/auth/login')
    console.log()
  } else {
    console.log('\n⚠️ Some users failed. Check errors above.')
  }
}

main().then(() => process.exit(0)).catch(err => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})

