/**
 * Create Additional Test Users (Nurse, Accountant, Radiologist, Pharmacist)
 * 
 * Run: node scripts/create-additional-users.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

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

const additionalUsers = [
  {
    email: 'nurse@hospital.com',
    password: 'password123',
    fullName: 'Emily Davis',
    role: 'nurse',
    phone: '+1-555-0103',
    department: 'Emergency',
    licenseNumber: 'RN-67890'
  },
  {
    email: 'accountant@hospital.com',
    password: 'password123',
    fullName: 'Michael Brown',
    role: 'accountant',
    phone: '+1-555-0104',
    department: 'Finance'
  },
  {
    email: 'radiologist@hospital.com',
    password: 'password123',
    fullName: 'Dr. Rachel Green',
    role: 'radiologist',
    phone: '+1-555-0105',
    department: 'Radiology',
    specialization: 'Diagnostic Radiology',
    licenseNumber: 'MD-54321'
  },
  {
    email: 'pharmacist@hospital.com',
    password: 'password123',
    fullName: 'David Wilson',
    role: 'pharmacist',
    phone: '+1-555-0106',
    department: 'Pharmacy',
    licenseNumber: 'RPh-11223'
  }
]

async function createUser(userData) {
  console.log(`\n📝 Creating user: ${userData.email}`)
  
  try {
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        full_name: userData.fullName
      }
    })

    if (authError) {
      console.error(`❌ Error creating auth user: ${authError.message}`)
      return false
    }

    console.log(`✅ Auth user created: ${authData.user.id}`)

    // 2. Create staff profile
    const staffData = {
      id: authData.user.id,
      email: userData.email,
      full_name: userData.fullName,
      role: userData.role,
      phone: userData.phone,
      department: userData.department,
      is_active: true,
      profile_completed: true
    }

    if (userData.specialization) {
      staffData.specialization = userData.specialization
    }
    if (userData.licenseNumber) {
      staffData.license_number = userData.licenseNumber
    }

    const { error: staffError } = await supabase
      .from('staff')
      .insert(staffData)

    if (staffError) {
      console.error(`❌ Error creating staff profile: ${staffError.message}`)
      return false
    }

    console.log(`✅ Staff profile created: ${userData.role}`)
    return true

  } catch (error) {
    console.error(`❌ Unexpected error: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('🚀 Creating additional users...')
  
  let successCount = 0
  let failCount = 0

  for (const userData of additionalUsers) {
    const success = await createUser(userData)
    if (success) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('📊 RESULTS:')
  console.log(`✅ Successfully created: ${successCount} users`)
  console.log(`❌ Failed: ${failCount} users`)
  console.log('='.repeat(50))

  if (successCount === additionalUsers.length) {
    console.log('\n🎉 ALL ADDITIONAL USERS CREATED!')
    console.log('\n📋 New Login Credentials:')
    additionalUsers.forEach(user => {
      console.log(`   • ${user.email} / ${user.password} (${user.role})`)
    })
    console.log('\n✅ Total users now: 7 (Admin, Doctor, Receptionist, Nurse, Accountant, Radiologist, Pharmacist)')
  } else {
    console.log('\n⚠️  Some users failed to create.')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })

