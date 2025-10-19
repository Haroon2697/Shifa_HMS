#!/usr/bin/env node

/**
 * Verify All 7 Users Exist and Are Ready
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

async function verifyAllUsers() {
  console.log('=' .repeat(60))
  console.log('🔍 VERIFYING ALL 7 USERS')
  console.log('=' .repeat(60))
  console.log()

  const { data: allStaff, error } = await supabase
    .from('staff')
    .select('email, role, full_name, is_active, profile_completed')
    .order('role', { ascending: true })
    .order('email', { ascending: true })

  if (error) {
    console.error('❌ Error fetching users:', error.message)
    process.exit(1)
  }

  console.log(`📊 Total Users: ${allStaff.length}\n`)

  if (allStaff.length < 7) {
    console.log('⚠️ WARNING: Expected 7 users, found only', allStaff.length)
    console.log()
  }

  // Group by role
  const byRole = {}
  allStaff.forEach(user => {
    if (!byRole[user.role]) byRole[user.role] = []
    byRole[user.role].push(user)
  })

  // Display by role
  const expectedRoles = ['admin', 'doctor', 'receptionist', 'nurse', 'accountant', 'radiologist', 'pharmacist']
  
  console.log('=' .repeat(60))
  console.log('👥 USER LIST BY ROLE')
  console.log('=' .repeat(60))
  console.log()

  expectedRoles.forEach(role => {
    const users = byRole[role] || []
    const emoji = users.length > 0 ? '✅' : '❌'
    
    console.log(`${emoji} ${role.toUpperCase()}:`)
    
    if (users.length === 0) {
      console.log(`   ❌ MISSING - No ${role} user found!`)
      console.log()
    } else {
      users.forEach(user => {
        console.log(`   📧 ${user.email}`)
        console.log(`   👤 ${user.full_name}`)
        console.log(`   🔐 password123`)
        console.log(`   ${user.is_active ? '✅ Active' : '❌ Inactive'}`)
        console.log(`   ${user.profile_completed ? '✅ Profile Complete' : '⚠️ Profile Incomplete'}`)
        console.log()
      })
    }
  })

  // Summary
  console.log('=' .repeat(60))
  if (allStaff.length === 7) {
    console.log('🎉 SUCCESS! ALL 7 USERS ARE READY!')
  } else {
    console.log(`⚠️ INCOMPLETE: ${allStaff.length}/7 users exist`)
    const missing = expectedRoles.filter(role => !byRole[role])
    if (missing.length > 0) {
      console.log(`Missing roles: ${missing.join(', ')}`)
    }
  }
  console.log('=' .repeat(60))
  console.log()

  if (allStaff.length === 7) {
    console.log('🎯 NEXT STEPS:')
    console.log('   1. Go to: http://localhost:3001/auth/login')
    console.log('   2. Try logging in with any user above')
    console.log('   3. Password for all: password123')
    console.log()
    console.log('🧪 TRY THESE:')
    console.log('   • accountant@hospital.com / password123')
    console.log('   • nurse@hospital.com / password123')
    console.log('   • radiologist@hospital.com / password123')
    console.log('   • pharmacist@hospital.com / password123')
    console.log()
    console.log('🎉 Your Hospital Management System is complete!')
    console.log()
  }
}

verifyAllUsers().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})

