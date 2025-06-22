import { useSystemStore } from 'src/stores/systemStore';

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
