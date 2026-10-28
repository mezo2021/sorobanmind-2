import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://tnaetkpmqdmltfbigysp.supabase.co';
export const supabaseKey = 'sb_publishable_WseduPfJaq43k5oBD7o8WA_7YMle7Qo';

export const supabase = createClient(supabaseUrl, supabaseKey);