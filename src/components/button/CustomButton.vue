<template>
  <div>
    <q-btn unelevated :color :outline :flat dense :ripple="false" class="btn fit">
      <q-icon v-if="icon" left size="sm" :name="icon" class="gt-xs" />
      <span>{{ label }}</span>
    </q-btn>
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: () => 'primary',
  },
  outline: {
    type: Boolean,
    default: () => false,
  },
  flat: {
    type: Boolean,
    default: () => false,
  },
  label: {
    type: String,
    reqired: true,
  },
  icon: {
    type: String,
    default: () => '',
  },
});
</script>
