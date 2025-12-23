<template>
  <q-page padding>
    <tiptabEditor v-model="content" />
  </q-page>
</template>

<script setup>
import TiptabEditor from 'src/components/form/tibtab/TiptabEditor.vue';

const content = ref('');
</script>

<route lang="yaml">
meta:
  layout: default
</route>
