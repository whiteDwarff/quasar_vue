<template>
  <div class="row q-col-gutter-x-sm">
    <!-- 대분류 -->
    <q-select
      @update:modelValue="fetchedExamCategoryByDepth(2, $event)"
      v-model="form.cate1Code"
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
      @update:modelValue="fetchedExamCategoryByDepth(3, form.cate1Code, $event)"
      v-model="form.cate2Code"
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
      v-model="form.cate3Code"
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

const fetchedExamCategoryByDepth = async (cateStep, parentCode, subCode) => {
  const { data, error } = await $fetchedExamCategoryByDepth(cateStep, parentCode, subCode);

  if (!error) {
    if (cateStep == 1) {
      tops.value = data;
    } else if (cateStep == 2) {
      middles.value = data;
      form.value.cate2Code = null;
      form.value.cate3Code = null;
    } else {
      lows.value = data;
      form.value.cate3Code = null;
    }
  } else $showAlert(error);
};
fetchedExamCategoryByDepth(1);
</script>
