<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">시험분류</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">배정요소</span>
          <span class="current">시험분류</span>
        </div>
      </q-card-section>

      <q-card-section class="search-wrap">
        <div class="flex justify-center">
          <div class="contents input-area">
            <q-input
              v-model="param"
              :readonly="!nodes.length"
              outlined
              dense
              class="bg-white"
              placeholder="분류명을 입력하세요."
            />
          </div>
          <div class="button-area">
            <div class="flex">
              <q-space />
              <CustomButton
                :disabled="!nodes.length"
                @click="param = ''"
                label="초기화"
                :outline="true"
                class="q-mr-sm w-100"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <SubjectTreeForm v-model:nodes="nodes" :param />
    </q-card>
  </q-page>
</template>

<script setup>
const { nodes, param, getExamCategory } = useExamCategory();
getExamCategory();
</script>
