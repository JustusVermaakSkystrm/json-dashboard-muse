
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://feb-38d20.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlYi0zOGQyMCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzEwMDg0OTg4LCJleHAiOjIwMjU2NjA5ODh9.8HBJ4I5QRgSK6JOuUvTR-qcaAYnGIiEDRNLkM6ybPw4'
);
