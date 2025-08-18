<template>
  <div class="row q-col-gutter-x-sm">
    <!-- 대분류 -->
    <q-select
      @update:modelValue="fetchedSubjectCategoryByDepth(2, $event)"
      v-model="form.subjectCate1"
      :options="tops"
      dense
      outlined
      options-dense
      emit-value
      map-options
      class="col-4"
      label="대분류"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> 데이터가 없습니다 </q-item-section>
        </q-item>
      </template>
    </q-select>
    <!-- 중분류 -->
    <q-select
      @update:modelValue="fetchedSubjectCategoryByDepth(3, form.subjectCate1, $event)"
      v-model="form.subjectCate2"
      :options="middles"
      dense
      outlined
      options-dense
      emit-value
      map-options
      class="col-4"
      label="중분류"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> 데이터가 없습니다 </q-item-section>
        </q-item>
      </template>
    </q-select>
    <!-- 소분류 -->
    <q-select
      v-model="form.subjectCate3"
      :options="lows"
      dense
      outlined
      options-dense
      emit-value
      map-options
      class="col-4"
      label="소분류"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> 데이터가 없습니다 </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup>
const form = defineModel();

const tops = ref([]);
const middles = ref([]);
const lows = ref([]);

const fetchedSubjectCategoryByDepth = async (cateStep, parentCode, subCode) => {
  const { data, error } = await $fetchedSubjectCategoryByDepth(cateStep, parentCode, subCode);

  if (!error) {
    if (cateStep == 1) {
      tops.value = data;
    } else if (cateStep == 2) {
      middles.value = data;
      form.value.subjectCate2 = null;
      form.value.subjectCate3 = null;
    } else {
      lows.value = data;
      form.value.subjectCate3 = null;
    }
  } else $showAlert(error);
};
fetchedSubjectCategoryByDepth(1);
</script>
