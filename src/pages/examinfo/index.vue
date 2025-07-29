<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">시험정보</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">시험정보</span>
          <span class="current">시험정보등록</span>
        </div>
      </q-card-section>

      <q-card-section class="search-wrap">
        <div class="row q-col-gutter-md">
          <!-- 
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span class="label">회사명</span>
              <div class="content">
                <SelectFilter v-model="param.companySeq" />
              </div>
            </div>
          </div> 
          -->
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">시험명</span>
              <div class="content">
                <q-input
                  @keyup.enter="getExamList(1)"
                  v-model="param.examName"
                  outlined
                  dense
                  class="bg-white"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">등록자</span>
              <div class="content">
                <q-input
                  @keyup.enter="getExamList(1)"
                  v-model="param.regId"
                  outlined
                  dense
                  class="bg-white"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">등록일</span>
              <div class="content">
                <DatePicker v-model="param.regDay" :range="true" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex q-mt-lg">
          <q-space />
          <CustomButton
            @click="param = resetParam()"
            label="초기화"
            :outline="true"
            class="q-mr-md w-100"
          />
          <CustomButton @click="getExamList(1)" label="검색" class="w-100" />
        </div>
      </q-card-section>
    </q-card>

    <div class="flex items-baseline edit-btn-wrap">
      <p class="q-mt-auto">
        총 <span class="list-count">{{ rows.totalCount }}</span
        >개
      </p>
      <q-space />
      <CustomButton @click="$router.push('/examInfo/edit')" label="시험정보등록" />
    </div>

    <q-card flat>
      <q-table
        :rows="rows.data"
        :rows-per-page-options="[0]"
        flat
        bordered
        hide-pagination
        hide-selected-banner
      >
        <template #header>
          <q-tr>
            <q-th style="width: 5%">번호</q-th>
            <!-- <q-th style="width: 20%">회사명</q-th> -->
            <q-th style="width: 40%">시험명</q-th>
            <q-th style="width: 15%">등록자</q-th>
            <q-th style="width: 20%">등록일(년/월/일)</q-th>
            <q-th style="width: 20%">관리</q-th>
          </q-tr>
        </template>
        <template #body="props">
          <q-tr
            @click="currentRow = props.rowIndex"
            :props
            :class="{ current: currentRow == props.rowIndex }"
            class="cursor-pointer"
          >
            <q-td>{{ props.rowIndex + 1 }}</q-td>
            <q-td>{{ props.row.examName }}</q-td>
            <q-td>-</q-td>
            <q-td>{{ getTimeFormat(props.row.rgstDt) }}</q-td>
            <q-td>
              <div class="row q-col-gutter-sm">
                <RowEditButton
                  @click="updateExamInfoUsyn(props.row.examCode)"
                  :on="currentRow == props.rowIndex"
                  label="삭제"
                  icon="delete"
                  class="col-xs-12 col-md-6"
                />
                <RowEditButton
                  @click="$router.push(`/examInfo/edit/${props.row.examCode}`)"
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

      <PaginationTemp @update:modelValue="getExamList($event - 1)" v-model:page="param" />
    </q-card>
  </q-page>
</template>

<script setup>
const resetParam = () => {
  return {
    // companySeq: '',
    examName: '',
    regId: '',
    regDay: [],
    regStDt: null,
    regEnDt: null,
    current: 1,
    min: 1,
    max: 1,
  };
};
const param = ref({ ...resetParam(resetParam.value) });

const currentRow = ref(null);
const rows = ref({
  totalCount: 0,
  data: [],
});

// 시험목록 호출
const getExamList = async (current = null) => {
  const {
    data,
    count: totalCount,
    error,
    max,
  } = await $fetchedExamList({
    ...param.value,
    current,
  });

  if (!error) {
    rows.value = { data, totalCount };
    param.value.max = max;
  } else $showAlert('데이터 조회 실패하였습니다.');
};
getExamList(1);

// 삭제
const updateExamInfoUsyn = async (examCode) => {
  if (await $showConfirm('삭제하시겠습니까?')) {
    const { data, error } = await $updateExamInfoUsyn(examCode);

    if (!error && data.useFlag == 'N') {
      await getExamList(1);
      $showAlert('삭제되었습니다.');
    } else $showAlert(error);
  }
};

// 등록일 날짜 포맷 반환
const getTimeFormat = (str) => $getTimeFormat(str);
</script>
