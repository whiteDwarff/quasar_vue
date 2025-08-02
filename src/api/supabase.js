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
  const { data, error } = await supabase.storage
    .from('images')
    .upload(`profile/${fileName}`, file, { upsert: true });

  if (!error && data.path)
    return {
      path: data.path,
      error: null,
    };
  else {
    error;
  }
}
/**
 * 사용자 프로필 url 조회
 * @param {string} path
 * @returns string
 */
async function fetchedProfileImg(path) {
  const { data, error } = await supabase.storage.from('images').getPublicUrl(path);
  return error ? '' : data.publicUrl;
}

// supabase error message
const getErrorMessage = {
  PGRST116: '데이터 조회에 실패하였습니다.',
  PGRST204: '해당 테이블에 일치하는 컬럼이 없습니다.',
  PGRST200: '조회 가능한 테이블이 없거나, 외래키 조건이 잘못되었습니다.',
  '22P02': '데이터 유형이 잘못되었습니다.',
  42703: '해당 테이블에 일치하는 컬럼이 없습니다.',
};

export { supabase, addProfleImgByBucket, fetchedProfileImg, getErrorMessage };
