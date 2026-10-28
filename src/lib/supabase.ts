import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://tnaetkpmqdmltfbigysp.supabase.co';
// تم استخدام المفتاح الذي أرسلته للتو (لاحظ حرف l)
export const supabaseKey = 'sb_publishable_mjntwuRa8yJDaCthyzfDlg_MEGv-c3-';

export const supabase = createClient(supabaseUrl, supabaseKey);