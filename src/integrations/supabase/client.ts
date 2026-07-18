
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjdpjqobkguqmcsomvae.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZHBqcW9ia2d1cW1jc29tdmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMjY0NTYsImV4cCI6MjA5OTkwMjQ1Nn0.7uZtUzfVU1G6pIuI1ldhbkFqqRbRNdDtn5blF4p5hEA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

