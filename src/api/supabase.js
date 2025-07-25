import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const getErrorMessage = {
  PGRST116: '데이터 조회에 실패하였습니다.',
  PGRST204: '해당 테이블에 일치하는 컬럼이 없습니다.',
};

export { supabase, getErrorMessage };
