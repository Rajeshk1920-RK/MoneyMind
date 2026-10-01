import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wldkyhajckplgxsbmedp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsZGt5aGFqY2twbGd4c2JtZWRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NjE0NTksImV4cCI6MjEwNjMzNzQ1OX0.nrkRnI7R5-Xh1b484-ShJTu471Fa53BivPVwg8FejaA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
