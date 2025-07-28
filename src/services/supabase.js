import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = 'https://ilrqjhjjbonxzyvzmzoh.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlscnFqaGpqYm9ueHp5dnptem9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDQ2NDksImV4cCI6MjA2MDEyMDY0OX0.Vpcx4Lrh1Od5IbMgkwAIte1E8hai4KAmJPvo_aJjgFc'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
