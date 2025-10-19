#!/usr/bin/env node

/**
 * Complete HMS Setup Script
 * This script creates all missing users and verifies the setup
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

// All 7 users that should exist
const allUsers = [
  {
    email: 'admin@hospital.com',
    password: 'password123',
    fullName: 'System Administrator',
    role: 'admin',
    department: 'Administration'
  },
  {
    email: 'doctor@hospital.com',
    password: 'password123',
    fullName: 'Dr. Sarah Johnson',
    role: 'doctor',
    department: 'General Medicine',
    specialization: 'General Physician',
    licenseNumber: 'MD-2024-001'
  },
  {
    email: 'receptionist@hospital.com',
    password: 'password123',
    fullName: 'Emily Davis',
    role: 'receptionist',
    department: 'Front Desk'
  },
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

async function checkExistingUsers() {
  console.log('🔍 Checking existing users...\n')
  
  const { data: staffData, error } = await supabase
    .from('staff')
    .select('email, role, full_name, is_active')
    .order('email')

  if (error) {
    console.error('❌ Error checking users:', error.message)
    return []
  }

  return staffData || []
}

async function createUser(user) {
  try {
    // Step 1: Create auth user
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
      if (authError.message.includes('already registered')) {
        console.log(`   ⚠️ User ${user.email} already exists in auth`)
        return { success: true, existed: true }
      }
      throw authError
    }

    // Step 2: Create staff profile
    const { error: staffError } = await supabase
      .from('staff')
      .insert({
        id: authData.user.id,
        email: user.email,
        full_name: user.fullName,
        role: user.role,
        department: user.department,
        phone: '+1-555-0100',
        specialization: user.specialization || null,
        license_number: user.licenseNumber || null,
        is_active: true,
        profile_completed: true
      })

    if (staffError) {
      if (staffError.code === '23505') { // Duplicate key
        console.log(`   ⚠️ Staff profile for ${user.email} already exists`)
        return { success: true, existed: true }
      }
      throw staffError
    }

    return { success: true, existed: false }

  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function main() {
  console.log('=' .repeat(60))
  console.log('🏥 HOSPITAL MANAGEMENT SYSTEM - COMPLETE SETUP')
  console.log('=' .repeat(60))
  console.log()

  // Step 1: Check existing users
  const existingUsers = await checkExistingUsers()
  console.log(`📊 Found ${existingUsers.length} existing users:`)
  existingUsers.forEach(u => {
    console.log(`   ✓ ${u.email} (${u.role})`)
  })
  console.log()

  // Step 2: Determine which users need to be created
  const existingEmails = new Set(existingUsers.map(u => u.email))
  const usersToCreate = allUsers.filter(u => !existingEmails.has(u.email))

  if (usersToCreate.length === 0) {
    console.log('✅ All 7 users already exist!\n')
  } else {
    console.log(`🚀 Creating ${usersToCreate.length} missing users...\n`)

    for (const user of usersToCreate) {
      process.stdout.write(`   Creating ${user.email} (${user.role})... `)
      const result = await createUser(user)
      
      if (result.success) {
        if (result.existed) {
          console.log('already exists ✓')
        } else {
          console.log('created ✅')
        }
      } else {
        console.log(`failed ❌`)
        console.log(`      Error: ${result.error}`)
      }
    }
    console.log()
  }

  // Step 3: Verify all users
  console.log('🔍 Verifying all users...\n')
  const finalUsers = await checkExistingUsers()
  
  console.log('=' .repeat(60))
  console.log('📋 FINAL USER LIST')
  console.log('=' .repeat(60))
  
  const usersByRole = {}
  finalUsers.forEach(u => {
    if (!usersByRole[u.role]) usersByRole[u.role] = []
    usersByRole[u.role].push(u)
  })

  Object.keys(usersByRole).sort().forEach(role => {
    console.log(`\n${role.toUpperCase()}:`)
    usersByRole[role].forEach(u => {
      console.log(`  📧 ${u.email}`)
      console.log(`     👤 ${u.full_name}`)
      console.log(`     🔐 password123`)
      console.log(`     ${u.is_active ? '✅ Active' : '❌ Inactive'}`)
    })
  })

  console.log('\n' + '=' .repeat(60))
  console.log(`✅ SUCCESS! ${finalUsers.length} users ready`)
  console.log('=' .repeat(60))
  console.log('\n🎯 Next Steps:')
  console.log('   1. Go to: http://localhost:3001/auth/login')
  console.log('   2. Login with any user above')
  console.log('   3. Password for all: password123')
  console.log('\n🎉 Your Hospital Management System is ready!\n')
}

main().then(() => process.exit(0)).catch(err => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})

