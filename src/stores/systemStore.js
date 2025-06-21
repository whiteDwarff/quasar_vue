import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', () => {
  const alert = ref({
    visible: false,
    contents: '',
  })

  function $showAlert(contents) {
    alert.value.visible = true
    alert.value.contents = contents
  }

  return {
    alert,
    $showAlert,
  }
})
