import { createClient } from '@supabase/supabase-js';

export const SUPABASE_PROJECT_ID = 'efxjxwvfhotdgqaefksa';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

// Access env variable or default placeholder key
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmeGp4d3ZmaG90ZGdxYWVma3NhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTA0MDAwMH0.placeholderKey';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
