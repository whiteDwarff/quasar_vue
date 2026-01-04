<template>
  <div class="row q-col-gutter-x-sm">
    <!-- 대분류 -->
    <q-select
      @update:modelValue="getCategory($event, 2)"
      v-model="form.subjectCate1"
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
      v-model="form.subjectCate2"
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
      v-model="form.subjectCate3"
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
getSubjectCategoryByDepth(form.value, 1).then(res => root.value = res);

const getCategory = async (val, cateStep) => {
  // 대분류 변경 시
  if (cateStep === 2) {
    form.value.subjectCate1 = val;
    form.value.subjectCate2 = null;
    form.value.subjectCate3 = null;
    node.value = await getSubjectCategoryByDepth(form.value, 2);
    item.value = [];
    // 중분류 변경 시
  } else if (cateStep === 3) {
    form.value.subjectCate2 = val;
    form.value.subjectCate3 = null;
    item.value = await getSubjectCategoryByDepth(form.value, 3);
  }
};
</script>
