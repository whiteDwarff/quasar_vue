<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <tiptabEditor v-model="content" :height="500" />
      </div>
    </div>
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
