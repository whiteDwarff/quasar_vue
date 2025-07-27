import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * 사용자 프로필 이미지 저장
 * @param {file} file
 * @param {string} key
 * @returns object
 */
async function addProfleImgByBucket(file, key) {
  if (!file) return;

  let fileName = '';

  const ext = file.name.split('.').pop().toLowerCase();
  fileName = `${crypto.randomUUID()}-${key}.${ext}`;
  // 스토리지에 이미지 저장
  const { data, error } = await supabase.storage.from('images').upload(`profile/${fileName}`, file);

  if (!error && data.path)
    return {
      path: data.path,
      error: null,
    };
  else {
    error;
  }
}

// supabase error message
const getErrorMessage = {
  PGRST116: '데이터 조회에 실패하였습니다.',
  PGRST204: '해당 테이블에 일치하는 컬럼이 없습니다.',
};

export { supabase, addProfleImgByBucket, getErrorMessage };
