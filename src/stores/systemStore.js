import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useSystemStore = defineStore('system', () => {
  const alert = reactive({
    visible: false,
    contents: '',
  });

  const confirm = reactive({
    visible: false,
    contents: '',
    resolve: () => {},
  });

  const loading = ref(false);

  // alert
  function showAlert(contents) {
    alert.visible = true;
    alert.contents = contents;
  }
  // confirm
  function showConfirm(contents) {
    confirm.contents = contents;
    confirm.visible = true;

    return new Promise((resolve) => {
      confirm.resolve = resolve;
    });
  }
  function resolve() {
    confirm.visible = false;
    confirm.resolve(true);
  }
  function reject() {
    confirm.visible = false;
    confirm.resolve(false);
  }
  // loading
  function setLoading(status) {
    loading.value = status;
  }

  return {
    alert,
    showAlert,
    confirm,
    showConfirm,
    resolve,
    reject,
    loading,
    setLoading,
  };
});
