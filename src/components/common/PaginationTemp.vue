<template>
  <div class="row justify-center q-mt-lg">
    <q-pagination
      v-model="page.current"
      :min="page?.min || 1"
      :max="page?.max || 1"
      :max-pages="page?.maxPages"
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
      size="18px"
    />
  </div>
</template>
<script setup>
const page = defineModel('page')
const emit = defineEmits(['update:modelValue'])

/**
    @doc      https://quasar.dev/vue-components/pagination#qpagination-api
    @required page (v-model:page="value-name") 

    - min:       최소 페이지 개수
    - max:       최대 페이지 개수
    - maxPages : 페이지네이션 개수 (0번부터 n번까지만 보이게)
    - current  : 현재 페이지
 */
</script>
