<template>
  <q-dialog v-model="confirm.visible">
    <q-card style="width: 30rem">
      <q-card-section
        class="row items-center q-py-sm"
        style="border-bottom: 1px solid var(--border)"
      >
        <div class="text-h6">알림</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="reject" />
      </q-card-section>

      <q-card-section class="q-py-md"> {{ confirm.contents }}</q-card-section>

      <q-card-section class="flex justify-end q-py-sm" style="border-top: 1px solid var(--border)">
        <CustomButton @click="reject" label="취소" :outline="true" :flat="true" class="q-mr-xs" />
        <CustomButton @click="resolve" label="확인" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
const store = useSystemStore();

const { confirm } = storeToRefs(store);
const { resolve, reject } = store;
</script>
