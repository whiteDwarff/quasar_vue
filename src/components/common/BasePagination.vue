<template>
  <div class="row justify-center q-mt-lg">
    <q-pagination
      @update:modelValue="$emit('update:modelValue', $event)"
      v-model="page"
      :min="1"
      :max
      :max-pages="maxPages"
      :boundary-numbers="false"
      :ellipses="false"
      outline
      color="grey-5"
      active-color="primary"
      active-design="unelevated"
      active-text-color="white"
      direction-links
      boundary-links
      icon-first="keyboard_double_arrow_left"
      icon-last="keyboard_double_arrow_right"
      size="17px"
    />
  </div>
</template>
<script setup>
const page = defineModel('page');
const count = defineModel('count', { default: 0 });

const emit = defineEmits(['update:modelValue']);

const max = ref(1);
const maxPages = ref(process.env.PAGE_SIZE);

watch(count, (n) => {
  max.value = Math.ceil(n / maxPages.value);
});
</script>
