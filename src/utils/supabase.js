import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dirzaimedhupipxhisjo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpcnphaW1lZGh1cGlweGhpc2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNDUxMjksImV4cCI6MjEwMzkyMTEyOX0.tuBZsrUSHF1-27c4Px6bvcy5n5wqq5UJPrwgnyaWu5c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
