<template>
  <q-btn
    :ripple="false"
    unelevated
    size="sm"
    :color="active ? 'grey-2' : ''"
    padding="xs"
    class="hover"
  >
    <q-icon
      :style="iconStyle"
      :name="icon"
      :color="!active ? 'grey-14' : 'deep-purple-11'"
      size="xs"
    />
    <slot></slot>
    <q-tooltip v-if="tooltip" class="bg-grey">{{ tooltip }}</q-tooltip>
  </q-btn>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    reqired: true,
  },
  active: {
    type: Boolean,
  },
  tooltip: {
    type: String,
  },
  iconStyle: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
</script>

<style scoped>
i.q-icon,
i.bi {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  opacity: 0.9;
}
</style>
