// Force create users - assumes constraint is fixed
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

async function createUsers() {
  console.log('🚀 Force creating users (assuming constraint is fixed)...\n');

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (const user of additionalUsers) {
    console.log(`📝 Creating user: ${user.email}`);
    
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
        console.log(`   ❌ Error: ${authError.message}`);
        errors.push({ user: user.email, error: authError.message });
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
        errors.push({ user: user.email, error: profileError.message });
        failCount++;
      } else {
        console.log(`   ✅ Staff profile created\n`);
        successCount++;
      }

    } catch (error) {
      console.log(`   ❌ Unexpected error: ${error.message}\n`);
      errors.push({ user: user.email, error: error.message });
      failCount++;
    }
  }

  console.log('══════════════════════════════════════════════════════════');
  console.log('📊 RESULTS:');
  console.log(`✅ Successfully created: ${successCount} users`);
  console.log(`❌ Failed: ${failCount} users`);
  console.log('══════════════════════════════════════════════════════════\n');

  if (failCount > 0) {
    console.log('⚠️  ERRORS ENCOUNTERED:\n');
    errors.forEach(err => {
      console.log(`   • ${err.user}: ${err.error}`);
    });
    console.log('\n💡 Most common cause: Role constraint not fixed yet!');
    console.log('\n📋 Run this SQL in Supabase SQL Editor first:');
    console.log('🔗 https://supabase.com/dashboard/project/ercktstpairlhrarsboj/sql/new\n');
    console.log('─────────────────────────────────────────────────────────');
    console.log('ALTER TABLE public.staff DROP CONSTRAINT IF EXISTS staff_role_check;');
    console.log('ALTER TABLE public.staff ADD CONSTRAINT staff_role_check');
    console.log("CHECK (role IN ('admin', 'doctor', 'nurse', 'receptionist',");
    console.log("               'radiologist', 'pharmacist', 'accountant'));");
    console.log('─────────────────────────────────────────────────────────\n');
    console.log('Then run this script again!\n');
    process.exit(1);
  } else {
    console.log('🎉 ALL USERS CREATED SUCCESSFULLY!\n');
    console.log('📋 Login Credentials (password: password123):');
    additionalUsers.forEach(user => {
      console.log(`   • ${user.email} (${user.role})`);
    });
    console.log('\n✅ You can now login at: http://localhost:3000/auth/login\n');
  }
}

createUsers();

