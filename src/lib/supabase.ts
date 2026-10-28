import { createClient } from '@supabase/supabase-js';

// ⚠️ هذه المفاتيح آمنة للاستخدام في الواجهة الأمامية (مع تفعيل RLS)
export const supabaseUrl = 'https://tnaetkpmqdmltfbigysp.supabase.co';
export const supabaseKey = 'sb_publishable_mjntwuRa8yJDaCthyzfD1g_MEGv-c3-';

export const supabase = createClient(supabaseUrl, supabaseKey);