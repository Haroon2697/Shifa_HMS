// Verify all users are created and can be queried
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

const expectedUsers = [
  { email: 'admin@hospital.com', role: 'admin', name: 'System Administrator' },
  { email: 'doctor@hospital.com', role: 'doctor', name: 'Dr. Sarah Johnson' },
  { email: 'receptionist@hospital.com', role: 'receptionist', name: 'Jane Smith' },
  { email: 'nurse@hospital.com', role: 'nurse', name: 'Emily Davis' },
  { email: 'accountant@hospital.com', role: 'accountant', name: 'Michael Brown' },
  { email: 'radiologist@hospital.com', role: 'radiologist', name: 'Dr. Lisa Anderson' },
  { email: 'pharmacist@hospital.com', role: 'pharmacist', name: 'Robert Wilson' },
];

async function verifyUsers() {
  console.log('🔍 Verifying all users...\n');

  try {
    // Get all staff profiles
    const { data: staffData, error: staffError } = await supabase
      .from('staff')
      .select('email, role, full_name, is_active, profile_completed')
      .order('email');

    if (staffError) {
      console.error('❌ Error querying staff:', staffError.message);
      process.exit(1);
    }

    console.log('📊 VERIFICATION RESULTS:\n');
    console.log('─────────────────────────────────────────────────────────────');

    let allPresent = true;
    expectedUsers.forEach(expectedUser => {
      const found = staffData.find(staff => staff.email === expectedUser.email);
      
      if (found) {
        const roleMatch = found.role === expectedUser.role;
        const active = found.is_active;
        const completed = found.profile_completed;
        
        console.log(`✅ ${expectedUser.email}`);
        console.log(`   Name: ${found.full_name}`);
        console.log(`   Role: ${found.role} ${roleMatch ? '✅' : '❌ MISMATCH'}`);
        console.log(`   Active: ${active ? '✅' : '❌'}`);
        console.log(`   Profile Completed: ${completed ? '✅' : '❌'}`);
        console.log('');
      } else {
        console.log(`❌ ${expectedUser.email} - NOT FOUND!`);
        console.log('');
        allPresent = false;
      }
    });

    console.log('─────────────────────────────────────────────────────────────');
    console.log('📈 SUMMARY:\n');
    console.log(`Expected users: ${expectedUsers.length}`);
    console.log(`Found users: ${staffData.length}`);

    if (allPresent && staffData.length === expectedUsers.length) {
      console.log('\n🎉 SUCCESS! All users are created and configured correctly!');
      console.log('\n✅ You can now test login at: http://localhost:3000/auth/login');
      console.log('\n📋 Login Credentials (all use password: password123):');
      expectedUsers.forEach(user => {
        console.log(`   • ${user.email} (${user.role})`);
      });
    } else if (allPresent && staffData.length > expectedUsers.length) {
      console.log('\n⚠️  All expected users found, but there are extra users in the database.');
    } else {
      console.log('\n❌ FAIL! Some users are missing. Please run:');
      console.log('   node scripts/create-additional-users.js');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    process.exit(1);
  }
}

verifyUsers();

