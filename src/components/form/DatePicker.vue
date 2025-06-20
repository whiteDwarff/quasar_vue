<template>
  <VueDatePicker
    v-model="modelValue"
    :enable-time-picker="false"
    locale="ko"
    format="yyyy-MM-dd"
    selectText="선택"
    cancelText="취소"
    :range
  />
</template>

<script setup>
const modelValue = defineModel()

defineProps({
  range: {
    type: Boolean,
    default: () => false,
  },
})
</script>

<style>
.dp__input {
  height: 41px;
  border: 1px solid rgba(0, 0, 0, 0.24);
  transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 13px;
}
.dp__input:hover:not(.dp__input_focus) {
  border: 1px solid #000;
}
.dp__input_focus {
  border: 2px solid var(--q-primary) !important;
}
</style>
