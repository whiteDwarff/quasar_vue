<template>
  <div>
    <q-btn :disable dense unelevated outline color="grey-5" class="q-px-md fit">
      <q-icon left :name="`sym_o_${icon}`" size="xs" class="text-grey-7 gt-xs" />
      <span class="text-grey-9">{{ label }}</span>
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
});
</script>
