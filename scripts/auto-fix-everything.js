// Automated fix script with instructions
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function checkCurrentState() {
  console.log('🔍 Checking current state...\n');
  
  const { data: staffData, error } = await supabase
    .from('staff')
    .select('email, role, full_name')
    .order('email');

  if (error) {
    console.error('❌ Error:', error.message);
    return null;
  }

  console.log(`📊 Found ${staffData.length} users:\n`);
  staffData.forEach(staff => {
    console.log(`   ✅ ${staff.email} (${staff.role})`);
  });
  console.log('');

  return staffData;
}

async function createMissingUsers() {
  const additionalUsers = [
    {
      email: 'nurse@hospital.com',
      password: 'password123',
      fullName: 'Emily Davis',
      role: 'nurse',
      department: 'General Ward',
    },
    {
      email: 'accountant@hospital.com',
      password: 'password123',
      fullName: 'Michael Brown',
      role: 'accountant',
      department: 'Finance',
    },
    {
      email: 'radiologist@hospital.com',
      password: 'password123',
      fullName: 'Dr. Lisa Anderson',
      role: 'radiologist',
      department: 'Radiology',
      specialization: 'Radiologist',
      license_number: 'LIC-RAD-5678',
    },
    {
      email: 'pharmacist@hospital.com',
      password: 'password123',
      fullName: 'Robert Wilson',
      role: 'pharmacist',
      department: 'Pharmacy',
      license_number: 'LIC-PHAR-9012',
    },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const user of additionalUsers) {
    console.log(`\n📝 Creating user: ${user.email}`);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          role: user.role,
        },
      });

      if (authError) {
        console.log(`❌ Error: ${authError.message}`);
        failCount++;
        continue;
      }

      console.log(`   ✅ Auth user created: ${authData.user.id}`);

      const { error: profileError } = await supabase
        .from('staff')
        .insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.fullName,
          role: user.role,
          department: user.department,
          specialization: user.specialization,
          license_number: user.license_number,
          is_active: true,
          profile_completed: true,
        });

      if (profileError) {
        console.log(`   ❌ Profile error: ${profileError.message}`);
        failCount++;
      } else {
        console.log(`   ✅ Staff profile created`);
        successCount++;
      }

    } catch (error) {
      console.log(`❌ Unexpected error: ${error.message}`);
      failCount++;
    }
  }

  return { successCount, failCount };
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  🏥 Hospital Management System - Auto Fix Script        ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Step 1: Check current state
  const currentStaff = await checkCurrentState();
  if (!currentStaff) {
    process.exit(1);
  }

  const missingCount = 7 - currentStaff.length;
  
  if (missingCount === 0) {
    console.log('🎉 All 7 users already exist! Nothing to do.\n');
    rl.close();
    return;
  }

  console.log(`⚠️  Missing ${missingCount} users\n`);
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('⚠️  IMPORTANT: Before creating users, you must fix the role constraint!\n');
  console.log('📋 Run this SQL in Supabase SQL Editor:');
  console.log('🔗 https://supabase.com/dashboard/project/ercktstpairlhrarsboj/sql/new\n');
  console.log('─────────────────────────────────────────────────────────────');
  console.log('ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;');
  console.log('ALTER TABLE public.staff ADD CONSTRAINT staff_role_check');
  console.log("CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist',");
  console.log("               'radiologist', 'pharmacist', 'accountant'));");
  console.log('─────────────────────────────────────────────────────────────\n');

  const answer = await question('Have you run the SQL above? (yes/no): ');

  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('\n⚠️  Please run the SQL first, then run this script again.\n');
    rl.close();
    return;
  }

  console.log('\n✅ Great! Now creating missing users...\n');
  console.log('═══════════════════════════════════════════════════════════\n');

  const { successCount, failCount } = await createMissingUsers();

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 RESULTS:');
  console.log(`✅ Successfully created: ${successCount} users`);
  console.log(`❌ Failed: ${failCount} users`);
  console.log('═══════════════════════════════════════════════════════════\n');

  if (failCount > 0) {
    console.log('⚠️  Some users failed to create.');
    console.log('💡 Most likely cause: You need to run the SQL constraint fix first!\n');
    console.log('📋 Run the SQL above in Supabase Dashboard, then run this script again.\n');
  } else {
    console.log('🎉 ALL USERS CREATED SUCCESSFULLY!\n');
    console.log('📋 Login Credentials (password: password123):');
    console.log('   • nurse@hospital.com (nurse)');
    console.log('   • accountant@hospital.com (accountant)');
    console.log('   • radiologist@hospital.com (radiologist)');
    console.log('   • pharmacist@hospital.com (pharmacist)\n');
    console.log('✅ You can now login at: http://localhost:3000/auth/login\n');
  }

  rl.close();
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  rl.close();
  process.exit(1);
});

