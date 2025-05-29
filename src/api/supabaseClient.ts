import { createClient } from '@supabase/supabase-js';

// Reemplaza estos valores por los de tu proyecto Supabase
const supabaseUrl = 'https://dmvpkamnflxkhfeoqhdg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtdnBrYW1uZmx4a2hmZW9xaGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDE1MDksImV4cCI6MjA2MDUxNzUwOX0.0dTK8lke8bCa1xjIZkNRmxzolsLgU07cnmAE3Kt5MUs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
