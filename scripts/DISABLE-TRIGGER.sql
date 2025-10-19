-- Emergency fix: Disable the problematic trigger
-- Run this if you're getting "Database error querying schema" errors
-- This allows login to work while we fix the trigger

-- Disable the trigger temporarily
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the problematic function
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

SELECT 'Trigger disabled - you can now login!' as status;
SELECT 'Note: You will need to manually create staff profiles after signup' as warning;
