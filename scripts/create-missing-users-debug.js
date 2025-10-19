#!/usr/bin/env node

/**
 * Create Missing Users with Detailed Debug
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

const usersToCreate = [
  {
    email: 'nurse@hospital.com',
    password: 'password123',
    fullName: 'Jessica Martinez',
    role: 'nurse',
    department: 'General Ward',
    specialization: 'General Nursing',
    licenseNumber: 'RN-2024-001'
  },
  {
    email: 'accountant@hospital.com',
    password: 'password123',
    fullName: 'Michael Brown',
    role: 'accountant',
    department: 'Finance'
  },
  {
    email: 'radiologist@hospital.com',
    password: 'password123',
    fullName: 'Dr. Robert Wilson',
    role: 'radiologist',
    department: 'Radiology',
    specialization: 'Diagnostic Radiology',
    licenseNumber: 'RAD-2024-001'
  },
  {
    email: 'pharmacist@hospital.com',
    password: 'password123',
    fullName: 'Lisa Anderson',
    role: 'pharmacist',
    department: 'Pharmacy',
    licenseNumber: 'PHM-2024-001'
  }
]

async function createUser(user) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Creating: ${user.email} (${user.role})`)
  console.log('='.repeat(60))

  try {
    // Step 1: Create auth user
    console.log('Step 1: Creating auth user...')
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: {
        full_name: user.fullName,
        role: user.role
      }
    })

    if (authError) {
      console.log('❌ Auth creation failed!')
      console.log('   Error message:', authError.message)
      console.log('   Error status:', authError.status)
      console.log('   Full error:', JSON.stringify(authError, null, 2))
      
      if (authError.message.includes('already registered')) {
        console.log('   User already exists in auth, checking staff profile...')
        
        // Try to get the existing user
        const { data: users } = await supabase.auth.admin.listUsers()
        const existingUser = users.users.find(u => u.email === user.email)
        
        if (existingUser) {
          console.log('   Found existing user:', existingUser.id)
          return await createStaffProfile(existingUser.id, user)
        }
      }
      return false
    }

    console.log('✅ Auth user created:', authData.user.id)

    // Step 2: Create staff profile
    return await createStaffProfile(authData.user.id, user)

  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
    console.log('   Stack:', error.stack)
    return false
  }
}

async function createStaffProfile(userId, user) {
  console.log('Step 2: Creating staff profile...')
  
  const staffData = {
    id: userId,
    email: user.email,
    full_name: user.fullName,
    role: user.role,
    department: user.department,
    phone: '+1-555-0100',
    specialization: user.specialization || null,
    license_number: user.licenseNumber || null,
    is_active: true,
    profile_completed: true
  }

  console.log('   Staff data:', JSON.stringify(staffData, null, 2))

  const { data, error: staffError } = await supabase
    .from('staff')
    .insert(staffData)
    .select()

  if (staffError) {
    console.log('❌ Staff profile creation failed!')
    console.log('   Error message:', staffError.message)
    console.log('   Error code:', staffError.code)
    console.log('   Error details:', staffError.details)
    console.log('   Error hint:', staffError.hint)
    console.log('   Full error:', JSON.stringify(staffError, null, 2))
    
    if (staffError.code === '23505') {
      console.log('   Profile already exists (duplicate key)')
      return true
    }
    return false
  }

  console.log('✅ Staff profile created successfully!')
  console.log('   Data:', JSON.stringify(data, null, 2))
  return true
}

async function main() {
  console.log('🏥 Creating Missing Users with Debug Info\n')

  for (const user of usersToCreate) {
    const success = await createUser(user)
    if (success) {
      console.log(`\n✅ ${user.email} - SUCCESS\n`)
    } else {
      console.log(`\n❌ ${user.email} - FAILED\n`)
    }
    
    // Small delay between users
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n' + '='.repeat(60))
  console.log('🔍 Final Verification')
  console.log('='.repeat(60))

  const { data: allStaff } = await supabase
    .from('staff')
    .select('email, role, full_name')
    .order('email')

  console.log(`\nTotal users: ${allStaff.length}`)
  allStaff.forEach(s => {
    console.log(`  ✓ ${s.email} (${s.role})`)
  })

  console.log('\n✅ Done!\n')
}

main().then(() => process.exit(0)).catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})

