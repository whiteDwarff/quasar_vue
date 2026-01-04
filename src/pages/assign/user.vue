<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">관리자 관리</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">배정관리</span>
          <span class="current">관리자 관리</span>
        </div>
      </q-card-section>

      <q-card-section class="search-wrap">
        <div class="row q-col-gutter-md">
          <div class="col-xs-6 col-sm-6">
            <div class="flex items-center">
              <span class="label">아이디</span>
              <div class="content">
                <q-input v-model="param.userId" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-6 col-sm-6">
            <div class="flex items-center">
              <span class="label">이름</span>
              <div class="content">
                <q-input v-model="param.userNm" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-6 col-sm-6">
            <div class="flex items-center">
              <span class="label">연락처</span>
              <div class="content">
                <q-input v-model="param.tel" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-6 col-sm-6">
            <div class="flex items-center">
              <span class="label">등록일(년/월/일)</span>
              <div class="content">
                <q-input v-model="param.regDt" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-6 col-sm-6">
            <div class="flex items-center">
              <span class="label">구분</span>
              <div class="content">
                <div class="check-wrap full-width">
                  <q-checkbox v-model="param.userType" val="1" size="sm" label="문항출제자" />
                  <q-checkbox v-model="param.userType" val="2" size="sm" label="문항관리자" />
                  <q-checkbox v-model="param.userType" val="3" size="sm" label="채점자" />
                  <q-checkbox v-model="param.userType" val="4" size="sm" label="감독관" />
                  <q-checkbox v-model="param.userType" val="5" size="sm" label="일반관리자" />
                </div>
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
          <CustomButton label="검색" class="w-100" />
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-y-sm edit-btn-wrap">
      <p class="q-mt-auto col-xs-12 col-md-1">
        총 <span class="list-count">{{ rows.length }}</span
        >개
      </p>
      <!-- <q-space /> -->
      <div class="col-xs-12 col-md-11 row q-col-gutter-sm justify-end">
        <CustomButton @click="$router.push('/assign/userEdit')" label="사용자등록" />
        <CustomButton @click="examineeDelete()" label="삭제" color="warning" outline />
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
        flat
        bordered
        selection="multiple"
        row-key="userSeq"
        hide-pagination
        hide-selected-banner
      >
        <template #header="props">
          <q-tr>
            <q-th><q-checkbox v-model="props.selected" /></q-th>
            <q-th style="width: 5%">번호</q-th>
            <q-th style="width: 10%">아이디</q-th>
            <q-th style="width: 20%">이름</q-th>
            <q-th style="width: 17%">연락처</q-th>
            <q-th style="width: 20%">이메일</q-th>
            <q-th style="width: 7%">등록일(년/월/일)</q-th>
            <q-th style="width: 20%">관리</q-th>
          </q-tr>
        </template>

        <template #body="props">
          <q-tr
            @click="currentRow = props.rowIndex"
            :props="props"
            :class="{ current: currentRow == props.rowIndex }"
            class="cursor-pointer"
          >
            <q-td> <q-checkbox v-model="props.selected" /></q-td>
            <q-td>{{ props.row.no }}</q-td>
            <q-td>{{ props.row.userId }}</q-td>
            <q-td>{{ props.row.userNm }}</q-td>
            <q-td>{{ props.row.tel }}</q-td>
            <q-td>{{ props.row.email }}</q-td>
            <q-td>{{ props.row.regDt }}</q-td>
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

    <FileUploadDialog v-model="visible" url="test" />
  </q-page>
</template>

<script setup>
const resetParam = () => {
  return {
    userId: '',
    userNm: '',
    tel: '',
    regDt: '',
    current: 1,
    min: 1,
    max: 1,
    userType: [],
  };
};
const param = ref({ ...resetParam() });

const selected = ref([]);
const currentRow = ref(null);

const visible = ref(false);

const rows = ref([
  {
    no: 1,
    userSeq: 100,
    userId: 'admin1',
    userNm: '똔깡버',
    tel: '010-1111-2222',
    email: 'admin1@naver.com',
    regDt: '2025-06-28',
  },
  {
    no: 2,
    userSeq: 101,
    userId: 'admin2',
    userNm: '똔깡뻐',
    tel: '010-2222-3333',
    email: 'admin2@naver.com',
    regDt: '2025-06-28',
  },
]);

const examineeDelete = async (examinee = null) => {
  if (!selected.value.length && !examinee) return $showAlert('삭제할 데이터를 선택해주세요.');

  const status = await $showConfirm('삭제하시겠습니까?');

  if (status) {
    // axios
    const arr = examinee ? [examinee] : selected.value;
    console.log(arr);
  }
};
</script>

<route lang="yaml">
meta:
  layout: default
</route>
