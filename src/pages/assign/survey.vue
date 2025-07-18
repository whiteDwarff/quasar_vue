<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">설문관리</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">배정관리</span>
          <span class="current">설문관리</span>
        </div>
      </q-card-section>

      <q-card-section class="search-wrap">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">제목</span>
              <div class="content">
                <q-input v-model="param.title" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">내용</span>
              <div class="content">
                <q-input v-model="param.memo" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-md-4">
            <div class="flex">
              <q-space />
              <CustomButton
                @click="param = resetParam()"
                label="초기화"
                :outline="true"
                class="q-mr-md w-100"
              />
              <CustomButton label="검색" class="w-100" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row items-baseline edit-btn-wrap">
      <p class="q-mt-auto">
        총 <span class="list-count">{{ rows.length }}</span
        >개
      </p>
      <q-space />
      <div class="flex justify-end">
        <CustomButton label="삭제" color="warning" outline class="q-mr-sm w-100" />
        <CustomButton @click="$router.push('/assign/surveyEdit')" label="설문등록" />
      </div>
    </div>

    <q-card flat>
      <q-table :rows="rows" flat bordered hide-pagination>
        <template #header="props">
          <q-tr :props="props">
            <q-th style="width: 5%">
              <q-checkbox @update:model-value="toggleSelected" v-model="isAll" />
            </q-th>
            <q-th style="width: 5%">번호</q-th>
            <q-th style="width: 25%">제목</q-th>
            <q-th style="width: 30%">내용</q-th>
            <q-th style="width: 5%">문항수</q-th>
            <q-th style="width: 20%">관리</q-th>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr
            @click="currentRow = props.rowIndex"
            :props="props"
            no-hover
            :class="{ current: currentRow == props.rowIndex }"
            class="cursor-pointer"
          >
            <q-td>
              <q-checkbox
                @update:modelValue="selectSurveyItem"
                v-model="selected"
                :val="props.row"
                :disable="!props.row.delState"
              />
            </q-td>
            <q-td>{{ props.rowIndex + 1 }}</q-td>
            <q-td>{{ props.row.title }}</q-td>
            <q-td>{{ props.row.memo }}</q-td>
            <q-td>{{ props.row.surveyCount }}</q-td>
            <q-td>
              <div class="row q-col-gutter-sm">
                <RowEditButton
                  @click="examineeDelete(props.row)"
                  label="삭제"
                  icon="delete"
                  class="col-xs-12 col-md-6"
                />
                <RowEditButton label="수정" icon="edit" class="col-xs-12 col-md-6" />
              </div>
            </q-td>
          </q-tr>
        </template>

        <template #no-data>
          <div class="full-width text-center">데이터가 없습니다.</div>
        </template>
      </q-table>

      <PaginationTemp v-model:page="param" />
    </q-card>
  </q-page>
</template>

<script setup>
const resetParam = () => {
  return {
    title: '',
    memo: '',
    current: 1,
    min: 1,
    max: 1,
  };
};
const param = ref({ ...resetParam() });

const selected = ref([]);
const isAll = ref(false);
const currentRow = ref(null);

const rows = ref([
  {
    surveyCode: 100,
    title: '오늘은 칼퇴를 할 것인가요?',
    memo: '칼퇴위원회',
    surveyCount: 4,
    delState: false,
  },
  {
    surveyCode: 101,
    title: 'TMS 시스템에 만족하시나요',
    memo: '아니오',
    surveyCount: 1,
    delState: true,
  },
]);
// 테이블 row의 checkbox 선택
const selectSurveyItem = (event) => {
  isAll.value = rows.value.filter((row) => row.delState).length == event.length;
};
// 삭제 가능한 항목 제외 전체 선택
const toggleSelected = (event) => {
  if (event) {
    selected.value = rows.value.filter((row) => row.delState);
    return;
  }
  isAll.value = false;
  selected.value = [];
};
</script>
