import { createClient } from '@supabase/supabase-js';

// ⚠️ هذه المفاتيح آمنة للاستخدام في الواجهة الأمامية
const supabaseUrl = 'https://tnaetkpmqdmltfbigysp.supabase.co';
const supabaseKey = 'sb_publishable_mjntwuRa8yJDaCthyzfDlg_MEGv-c3-';

export const supabase = createClient(supabaseUrl, supabaseKey);