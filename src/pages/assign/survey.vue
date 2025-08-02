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
                <q-input
                  @keyup.enter="fetchedSurveyList(1)"
                  v-model="param.researchTitle"
                  outlined
                  dense
                  class="bg-white"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">내용</span>
              <div class="content">
                <q-input
                  @keyup.enter="fetchedSurveyList(1)"
                  v-model="param.researchMemo"
                  outlined
                  dense
                  class="bg-white"
                />
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
              <CustomButton @click="fetchedSurveyList(1)" label="검색" class="w-100" />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row items-baseline edit-btn-wrap">
      <p class="q-mt-auto">
        총 <span class="list-count">{{ totalCount }}</span
        >개
      </p>
      <q-space />
      <div class="flex justify-end">
        <CustomButton
          @click="surveyDelete(null)"
          label="삭제"
          color="warning"
          outline
          class="q-mr-sm w-100"
        />
        <CustomButton @click="$router.push('/assign/surveyEdit')" label="설문등록" />
      </div>
    </div>

    <q-card flat>
      <q-table
        v-model:selected="selected"
        :rows="rows"
        :rows-per-page-options="[0]"
        selection="multiple"
        row-key="researchCode"
        flat
        bordered
        hide-pagination
        hide-selected-banner
      >
        <template #header="props">
          <q-tr :props="props">
            <q-th><q-checkbox v-model="props.selected" /></q-th>
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
            <q-td> <q-checkbox v-model="props.selected" /></q-td>
            <q-td>{{ props.rowIndex + 1 }}</q-td>
            <q-td>{{ props.row.researchTitle }}</q-td>
            <q-td>{{ props.row.researchMemo }}</q-td>
            <q-td>{{ props.row.tbResearchItemInfo.length }}</q-td>
            <q-td>
              <div class="row q-col-gutter-sm">
                <RowEditButton
                  @click="surveyDelete(props.row.researchCode)"
                  :on="currentRow == props.rowIndex"
                  label="삭제"
                  icon="delete"
                  class="col-xs-12 col-md-6"
                />
                <RowEditButton
                  @click="$router.push(`/assign/surveyEdit/${props.row.researchCode}`)"
                  :on="currentRow == props.rowIndex"
                  label="수정"
                  icon="edit"
                  class="col-xs-12 col-md-6"
                />
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
    researchTitle: '',
    researchMemo: '',
    current: 1,
    min: 1,
    max: 1,
  };
};
const param = ref({ ...resetParam() });
const totalCount = ref(0);

const selected = ref([]);
const currentRow = ref(null);

const rows = ref([]);
// 설문목록 조회
const fetchedSurveyList = async (current = null) => {
  const { data, error, max, count } = await $fetchedSurveyList({
    ...param.value,
    current,
  });

  if (!error) {
    rows.value = data;
    currentRow.value = null;

    param.value.max = max;
    totalCount.value = count;
  } else $showAlert(error);
};
fetchedSurveyList(1);

// 설문삭제
const surveyDelete = async (researchCode) => {
  if (!researchCode) {
    if (!selected.value.length) return $showAlert('삭제할 설문을 선택해주세요.');
    else researchCode = selected.value;
  }

  if (await $showConfirm('삭제하시겠습니까?')) {
    const { error } = await $updateSurveyUsyn(researchCode);

    if (!error) {
      await fetchedSurveyList(1);
      $showAlert('삭제되었습니다.');
    } else $showAlert(error);
  }
};
</script>
