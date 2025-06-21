import { useSystemStore } from 'src/stores/systemStore';

/**
 * alert dialog 활성화
 * @param { string } contents
 */
export function showAlert(value) {
  useSystemStore().$showAlert(value);
}
