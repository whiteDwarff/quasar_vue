<template>
  <div>
    <q-btn
      :disable
      dense
      unelevated
      outline
      color="grey-5"
      :class="{ current: on }"
      class="q-px-md fit"
    >
      <q-icon
        left
        :name="`sym_o_${icon}`"
        :class="{ current: on }"
        size="xs"
        class="text-grey-7 gt-sm"
      />
      <span :class="{ current: on }" class="text-grey-9">{{ label }}</span>
    </q-btn>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  icon: String,
  disable: {
    type: Boolean,
    default: () => false,
  },
  on: {
    type: Boolean,
    default: () => false,
  },
});
</script>

<style scoped>
.current {
  /* background: #fff !important; */
  color: #69a5fe !important;
}
</style>
