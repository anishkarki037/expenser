import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fywemvnrcvvolkwzousk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5d2Vtdm5yY3Z2b2xrd3pvdXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEyOTEyNjEsImV4cCI6MjAzNjg2NzI2MX0.wvfKS7BRzvQVVEfwhvijmpPsPubhXxhLE5MVTvxIVTg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
