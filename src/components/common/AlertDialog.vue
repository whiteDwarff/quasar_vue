<template>
  <q-dialog v-model="alert.visible">
    <q-card style="width: 30rem">
      <q-card-section
        class="row items-center q-py-sm"
        style="border-bottom: 1px solid var(--border)"
      >
        <div class="text-h6">알림</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-md"> {{ alert.contents }}</q-card-section>

      <q-card-section class="flex justify-end q-py-sm" style="border-top: 1px solid var(--border)">
        <PrimaryButton @click="alert.visible = false" label="확인" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useSystemStore } from 'src/stores/systemStore';

const { alert } = storeToRefs(useSystemStore());
</script>
