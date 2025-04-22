import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vwbknlnfvdcbxkizwwwg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3YmtubG5mdmRjYnhraXp3d3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyMTgxMDIsImV4cCI6MjA2MDc5NDEwMn0.uPY7TfcigJYFsMWcnaobce01cSq5d7F64TXxoF5uhsM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 