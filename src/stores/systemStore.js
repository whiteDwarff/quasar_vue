import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', () => {
  const alert = ref({
    visible: false,
    contents: '',
  });

  const confirm = ref({
    visible: false,
    contents: '',
    resolve: () => {},
  });

  function showAlert(contents) {
    alert.value.visible = true;
    alert.value.contents = contents;
  }

  function showConfirm(contents) {
    confirm.value.contents = contents;
    confirm.value.visible = true;

    return new Promise((resolve) => {
      confirm.value.resolve = resolve;
    });
  }

  function resolve() {
    confirm.value.visible = false;
    confirm.value.resolve(true);
  }

  function reject() {
    confirm.value.visible = false;
    confirm.value.resolve(false);
  }

  return {
    alert,
    showAlert,
    confirm,
    showConfirm,
    resolve,
    reject,
  };
});
