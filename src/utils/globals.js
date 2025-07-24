import { useSystemStore } from 'src/stores/systemStore';
import dayjs from 'dayjs';

const systemStore = useSystemStore();

/**
 * alert dialog 활성화
 * @param {string} contents
 */
export function $showAlert(value) {
  systemStore.showAlert(value);
}
/**
 * confirm dialog 활성화
 * @param {string} contents
 */
export function $showConfirm(value) {
  return systemStore.showConfirm(value);
}

/**
 * 시간 포맷 설정
 * @param {string} contents
 * @return {string}
 */
export function $getTimeFormat(str, isUltraTime = false) {
  if (!str) return '';
  return dayjs(str).format(!isUltraTime ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss');
}
/**
 * 페이징 개수 반환
 * @param {number} totalCount
 * @returns {number}
 */
export function $getPagingCount(totalCount) {
  if (!totalCount) return 1;
  return Math.ceil(totalCount / process.env.PAGE_LIMIT);
}
/**
 * 데이터목록 요청에 필요한 offset, limt 반환
 * @param {number} totalCount
 * @returns {object}
 */
export function $getPagingOffset(current) {
  const offset = (current - 1) * process.env.PAGE_LIMIT;
  const limit = offset + process.env.PAGE_LIMIT - 2;

  return {
    offset,
    limit,
  };
}
