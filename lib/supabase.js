import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://pmxhnefmuvgavwrmjmfw.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBteGhuZWZtdXZnYXZ3cm1qbWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyODU3NzMsImV4cCI6MjA5NDg2MTc3M30.vaWIIrIzoLhehy0rSFLI2454-ASy_-lXtzeKg2SOoMU";

export const supabase = createClient(url, key);
