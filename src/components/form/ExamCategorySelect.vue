<template>
  <div class="row q-col-gutter-x-sm">
    <!-- 대분류 -->
    <q-select
      @update:modelValue="getCategory($event, 2)"
      v-model="form.cate1Code"
      :options="root"
      dense
      outlined
      options-dense
      emit-value
      map-options
      class="col-4"
      label="대분류"
    >
      <template v-slot:no-option>
        <p class="text-grey q-px-md q-py-sm"> 데이터가 없습니다 </p>
      </template>
    </q-select>
    <!-- 중분류 -->
    <q-select
      @update:modelValue="getCategory($event, 3)"
      v-model="form.cate2Code"
      :options="node"
      dense
      outlined
      options-dense
      emit-value
      map-options
      class="col-4"
      label="중분류"
    >
      <template v-slot:no-option>
        <p class="text-grey q-px-md q-py-sm"> 데이터가 없습니다 </p>
      </template>
    </q-select>
    <!-- 소분류 -->
    <q-select
      v-model="form.cate3Code"
      :options="item"
      dense
      outlined
      options-dense
      emit-value
      map-options
      class="col-4"
      label="소분류"
    >
      <template v-slot:no-option>
        <p class="text-grey q-px-md q-py-sm"> 데이터가 없습니다 </p>
      </template>
    </q-select>
  </div>
</template>

<script setup>
const form = defineModel();

const root = ref([]);
const node = ref([]);
const item = ref([]);

// 대분류 요청
getExamCategoryByDepth(form.value, 1).then(res => root.value = res);

const getCategory = async (val, cateStep) => {
  // 대분류 변경 시
  if (cateStep === 2) {
    form.value.cate1Code = val;
    form.value.cate2Code = null;
    form.value.cate3Code = null;
    node.value = await getExamCategoryByDepth(form.value, 2);
    item.value = [];
    // 중분류 변경 시
  } else if (cateStep === 3) {
    form.value.cate2Code = val;
    form.value.cate3Code = null;
    item.value = await getExamCategoryByDepth(form.value, 3);
  }
};
</script>
