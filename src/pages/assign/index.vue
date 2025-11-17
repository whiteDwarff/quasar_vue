<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">응시자관리</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">배정관리</span>
          <span class="current">응시자관리</span>
        </div>
      </q-card-section>

      <q-card-section class="row q-col-gutter-md search-wrap">
        <div class="row col-12 q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">응시번호</span>
              <div class="content">
                <q-input
                  @keyup.enter="getExamineeList(1)"
                  v-model="param.id"
                  outlined
                  dense
                  class="bg-white"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">성별</span>
              <div class="content">
                <q-select
                  v-model="param.gender"
                  :options="[
                    { label: '전체', value: '' },
                    { label: '남', value: '1' },
                    { label: '여', value: '2' },
                  ]"
                  outlined
                  dense
                  options-dense
                  emit-value
                  map-options
                  class="bg-white"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">성명</span>
              <div class="content">
                <q-input
                  @keyup.enter="getExamineeList(1)"
                  v-model="param.name"
                  outlined
                  dense
                  class="bg-white"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">대학</span>
              <div class="content">
                <q-input
                  @keyup.enter="getExamineeList(1)"
                  v-model="param.college"
                  outlined
                  dense
                  class="bg-white"
                />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">학과</span>
              <div class="content">
                <q-input
                  @keyup.enter="getExamineeList(1)"
                  v-model="param.major"
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

        <div class="col-12 flex q-pr-md">
          <q-space />
          <CustomButton
            @click="resetParam()"
            label="초기화"
            :outline="true"
            class="q-mr-md w-100"
          />
          <CustomButton @click="getExamineeList(1)" label="검색" class="w-100" />
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-y-sm edit-btn-wrap">
      <p class="q-mt-auto col-xs-12 col-md-1">
        총 <span class="list-count">{{ totalCount }}</span
        >개
      </p>
      <!-- <q-space /> -->
      <div class="col-xs-12 col-md-11 row q-col-gutter-sm justify-end">
        <CustomButton @click="$router.push('/assign/examineeEdit')" label="응시자등록" />
        <CustomButton
          @click="updateExamineeUsyn(null)"
          label="삭제"
          color="warning"
          outline
          class="w-100"
        />
        <CustomButton label="엑셀양식 다운로드" icon="bi-cloud-download" color="grey-6" outline />
        <CustomButton
          @click="visible = true"
          label="엑셀로 업로드"
          icon="bi-filetype-xlsx"
          color="positive"
          outline
        />
      </div>
    </div>

    <q-card flat>
      <q-table
        v-model:selected="selected"
        :rows="rows"
        :rows-per-page-options="[0]"
        flat
        bordered
        selection="multiple"
        row-key="examineeId"
        hide-pagination
        hide-selected-banner
      >
        <template #header="props">
          <q-tr>
            <q-th><q-checkbox v-model="props.selected" /></q-th>
            <q-th style="width: 10%">응시번호</q-th>
            <q-th style="width: 5%">성별</q-th>
            <q-th style="width: 10%">이름</q-th>
            <q-th style="width: 15%">대학</q-th>
            <q-th style="width: 15%">학과</q-th>
            <q-th style="width: 10%">연락처</q-th>
            <q-th style="width: 10%">수정일</q-th>
            <q-th style="width: 20%">관리</q-th>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr
            @click="currentRow = props.row.examineeId"
            :props
            :class="{ current: currentRow == props.row.examineeId }"
            class="cursor-pointer"
          >
            <q-td> <q-checkbox v-model="props.selected" /></q-td>
            <q-td>{{ props.row.examineeId }}</q-td>
            <q-td>{{ props.row.examineeGender }}</q-td>
            <q-td>{{ props.row.examineeName }}</q-td>
            <q-td>{{ props.row.examineeCollege }}</q-td>
            <q-td>{{ props.row.examineeMajor }}</q-td>
            <q-td>{{ props.row.examineePhone }}</q-td>
            <q-td>{{ props.row.updtDt }}</q-td>
            <q-td>
              <div class="row q-col-gutter-sm">
                <RowEditButton
                  @click.stop="updateExamineeUsyn(props.row.examineeCode)"
                  :on="currentRow == props.rowIndex"
                  label="삭제"
                  icon="delete"
                  class="col-xs-12 col-md-6"
                />
                <RowEditButton
                  @click="$router.push(`/assign/examineeEdit/${props.row.examineeCode}`)"
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
      <!-- paging -->
      <PaginationTemp @update:modelValue="getExamineeList($event - 1)" v-model:page="param" />
    </q-card>
    <!-- dialog -->
    <FileUploadDialog v-model="visible" url="test" />
  </q-page>
</template>

<script setup>
// 컴포저블
const { param, rows, totalCount, getExamineeList, resetParam } = useExamineeList();
getExamineeList(1);

const selected = ref([]);
const currentRow = ref(null);
const visible = ref(false);

// 응시자 삭제
const updateExamineeUsyn = async (examineeCode) => {
  if (!examineeCode) {
    if (!selected.value.length) return $showAlert('삭제할 응시자를 선택해주세요.');
    else examineeCode = selected.value.map((m) => m.examineeCode);
  } else examineeCode = [examineeCode];

  if (!(await $showConfirm('삭제하시겠습니까?'))) return;

  const { status, message } = await updateExamineeUseFlag(examineeCode);

  if (!status) return $showAlert(message);

  $showAlert('삭제 성공하였습니다.');
  // 응시자 목록 조회
  getExamineeList(param.value.current);
  // 삭제할 응시자 초기화
  selected.value = [];
};
</script>
