import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oxqdiyozetifvzbxrtdi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94cWRpeW96ZXRpZnZ6YnhydGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4MTQ1OTIsImV4cCI6MjA4MDM5MDU5Mn0.tXmF-XMd5s_nu3Aapk_aLhMsLI0LIecFXWM7cCN2vHM';  


export const supabase = createClient(supabaseUrl, supabaseAnonKey);




