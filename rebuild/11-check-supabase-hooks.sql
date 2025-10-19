-- ============================================
-- STEP 11: CHECK FOR SUPABASE HOOKS & EXTENSIONS
-- ============================================
-- Purpose: Find any hidden triggers, hooks, or extensions causing auth issues
-- Run this in Supabase SQL Editor

-- 11.1: Check ALL triggers in the database (not just auth.users)
SELECT 
  '=== ALL TRIGGERS IN DATABASE ===' as section,
  trigger_schema,
  trigger_name,
  event_object_table,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers
ORDER BY trigger_schema, event_object_table, trigger_name;

-- 11.2: Check ALL functions in public schema
SELECT 
  '=== ALL FUNCTIONS IN PUBLIC SCHEMA ===' as section,
  routine_name,
  routine_type,
  data_type as return_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 11.3: Check for event triggers (database-wide)
SELECT 
  '=== EVENT TRIGGERS ===' as section,
  evtname as trigger_name,
  evtevent as trigger_event,
  evtenabled as enabled
FROM pg_event_trigger
ORDER BY evtname;

-- 11.4: Check for any functions that reference auth.users
SELECT 
  '=== FUNCTIONS REFERENCING auth.users ===' as section,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE pg_get_functiondef(p.oid) ILIKE '%auth.users%'
ORDER BY p.proname;

-- 11.5: Check Supabase realtime publications
SELECT 
  '=== REALTIME PUBLICATIONS ===' as section,
  schemaname,
  tablename,
  pubname
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY schemaname, tablename;

-- 11.6: Check if there are any policies on auth.users (shouldn't be!)
SELECT 
  '=== POLICIES ON auth.users ===' as section,
  policyname,
  permissive,
  cmd
FROM pg_policies
WHERE schemaname = 'auth' AND tablename = 'users';

-- 11.7: Check auth schema for any custom objects
SELECT 
  '=== CUSTOM OBJECTS IN auth SCHEMA ===' as section,
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'auth'
  AND table_name NOT IN ('users', 'refresh_tokens', 'instances', 'audit_log_entries', 
                          'identities', 'sessions', 'mfa_factors', 'mfa_challenges',
                          'sso_providers', 'sso_domains', 'saml_providers', 'saml_relay_states',
                          'flow_state', 'schema_migrations', 'one_time_tokens')
ORDER BY table_name;

-- FINAL CHECK: Look for the actual error in logs
SELECT '⚠️ IMPORTANT: Check Supabase Dashboard → Database → Logs for the actual error!' as important_note;
SELECT '📍 The 500 error might be caused by:' as possible_causes;
SELECT '   1. Database Webhooks (check Supabase Dashboard → Database → Webhooks)' as cause_1;
SELECT '   2. Edge Functions triggered on auth (check Supabase Dashboard → Edge Functions)' as cause_2;
SELECT '   3. RLS policies on auth.users (shown above)' as cause_3;
SELECT '   4. Hidden triggers we cannot see via SQL' as cause_4;
