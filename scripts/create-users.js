/**
 * Create Test Users Using Supabase Admin API
 * 
 * This script creates test users with properly hashed passwords
 * and automatically creates their staff profiles.
 * 
 * Run: node scripts/create-users.js
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

// Create Supabase client with service role (admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const testUsers = [
  {
    email: 'admin@hospital.com',
    password: 'password123',
    fullName: 'System Administrator',
    role: 'admin',
    phone: '+1-555-0100',
    department: 'Administration'
  },
  {
    email: 'doctor@hospital.com',
    password: 'password123',
    fullName: 'Dr. Sarah Johnson',
    role: 'doctor',
    phone: '+1-555-0101',
    department: 'Cardiology',
    specialization: 'Cardiologist',
    licenseNumber: 'MD-12345'
  },
  {
    email: 'receptionist@hospital.com',
    password: 'password123',
    fullName: 'Jane Smith',
    role: 'receptionist',
    phone: '+1-555-0102',
    department: 'Front Desk'
  }
]

async function createUser(userData) {
  console.log(`\n📝 Creating user: ${userData.email}`)
  
  try {
    // 1. Create auth user with Admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true, // Auto-confirm email
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

    // Add optional fields for doctors
    if (userData.specialization) {
      staffData.specialization = userData.specialization
    }
    if (userData.licenseNumber) {
      staffData.license_number = userData.licenseNumber
    }

    const { data: staffProfile, error: staffError } = await supabase
      .from('staff')
      .insert(staffData)
      .select()
      .single()

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
  console.log('🚀 Starting user creation...')
  console.log(`📡 Supabase URL: ${supabaseUrl}`)
  
  let successCount = 0
  let failCount = 0

  for (const userData of testUsers) {
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

  if (successCount === testUsers.length) {
    console.log('\n🎉 ALL USERS CREATED SUCCESSFULLY!')
    console.log('\n📋 Login Credentials:')
    testUsers.forEach(user => {
      console.log(`   • ${user.email} / ${user.password} (${user.role})`)
    })
    console.log('\n✅ You can now login at: http://localhost:3000/auth/login')
  } else {
    console.log('\n⚠️  Some users failed to create. Check errors above.')
  }
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  })

