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
                  @keyup.enter="getServeyList(1)"
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
                  @keyup.enter="getServeyList(1)"
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
                @click="resetParam()"
                label="초기화"
                :outline="true"
                class="q-mr-md w-100"
              />
              <CustomButton @click="getServeyList(1)" label="검색" class="w-100" />
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
          @click="updateResearchUsyn(null)"
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
            <q-th style="width: 5%"><q-checkbox v-model="props.selected" /></q-th>
            <q-th style="width: 5%">No</q-th>
            <q-th style="width: 23%">제목</q-th>
            <q-th style="width: 28%">내용</q-th>
            <q-th style="width: 7%">문항수</q-th>
            <q-th style="width: 12%">등록일</q-th>
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
            <q-td>{{ props.row.rowNum }}</q-td>
            <q-td>{{ props.row.researchTitle }}</q-td>
            <q-td>{{ props.row.researchMemo }}</q-td>
            <q-td>{{ props.row.itemCount }}</q-td>
            <q-td>{{ props.row.rgstDt }}</q-td>
            <q-td>
              <div class="row q-col-gutter-sm">
                <RowEditButton
                  @click.stop="updateResearchUsyn([props.row.researchCode])"
                  :on="currentRow == props.rowIndex"
                  label="삭제"
                  icon="delete"
                  class="col-xs-12 col-md-6"
                />
                <RowEditButton
                  @click.stop="$router.push(`/assign/surveyEdit/${props.row.researchCode}`)"
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

      <BasePagination
        @update:modelValue="getLocationList($event)"
        v-model:page="param.current"
        v-model:count="totalCount"
      />
    </q-card>
  </q-page>
</template>

<script setup>
const { param, rows, totalCount, getServeyList, resetParam } = useServeyList();
getServeyList(1);

const selected = ref([]);
const currentRow = ref(null);

// 시험장 삭제
const updateResearchUsyn = async (researchCode) => {
  if (!researchCode && !selected.value.length) return $showAlert('삭제할 항목을 선택해주세요.');
  if (!(await $showConfirm('삭제하시겠습니까?'))) return;

  const { status, message } = await updateServeyUseFlag(
    researchCode || selected.value.map((m) => m.researchCode),
  );

  if (!status) return $showAlert(message);

  $showAlert('삭제 성공하였습니다.');
  // 설문 목록 조회
  getServeyList(param.current);
  // 삭제한 설문 초기화
  selected.value = [];
};
</script>
