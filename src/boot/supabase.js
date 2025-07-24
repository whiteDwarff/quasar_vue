import { defineBoot } from '#q-app/wrappers';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default defineBoot(({ app }) => {
  app.config.globalProperties.$supabase = supabase;
});

export { supabase };
