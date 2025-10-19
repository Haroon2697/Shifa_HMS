-- Check if problematic triggers still exist

-- Check for triggers on auth.users table
SELECT 
  trigger_name,
  event_object_table,
  action_statement,
  '❌ THIS IS THE PROBLEM!' as issue
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth';

-- If the above returns ANY results, run this to remove them:
-- (Uncomment and run if you see triggers above)

/*
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_user_create() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
*/

SELECT 'If you see triggers above, uncomment and run the DROP commands' as instruction;
