<template>
  <router-view />
  <ConfirmDialog />
  <AlertDialog />
</template>

<script setup>
import { useQuasar } from 'quasar';

const { loading } = storeToRefs(useSystemStore());

const $q = useQuasar();

// loading
watch(loading, (newValue) => {
  newValue ? $q.loading.show() : $q.loading.hide();
});
</script>
