import { createClient } from '@supabase/supabase-js';

// Environment variables should be set:
// NEXT_PUBLIC_SUPABASE_URL
// NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// For server-side operations, we can use the service role (via SUPABASE_SERVICE_ROLE_KEY)
// This should only be used in trusted server contexts
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Only create client if credentials are available
function createSupabaseClient(url: string, key: string) {
  if (!url || !key) {
    return null;
  }
  return createClient(url, key);
}

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Server client with elevated privileges (only for internal/seed scripts)
export const supabaseAdmin = supabaseServiceKey && supabaseUrl
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// Database schema for rooms:
// Table: rooms
// - code: text PRIMARY KEY (6-char room code)
// - data: jsonb (Room object)
// - created_at: timestamptz (auto)
// - updated_at: timestamptz (auto)
export const ROOMS_TABLE = 'rooms';