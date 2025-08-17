<template>
  <div>
    <q-tree v-model:expanded="examExpanded" :nodes="examNodes" node-key="key" default-expand-all />

    <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
    >
      <q-tab name="schedule" label="일정등록" />
      <q-tab name="subject" label="과목등록" />
      <q-tab name="detail" label="상세정보등록" />
    </q-tabs>
  </div>
</template>

<script setup>
const examNodes = ref([]);
const examExpanded = ref([]);
$fechtedExamNodes().then((res) => (examNodes.value = res.data));

const tab = ref('schedule');
</script>

<style lang="scss" scoped></style>
