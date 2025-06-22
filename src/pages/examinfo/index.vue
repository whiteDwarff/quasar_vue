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
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span class="label">회사명</span>
              <div class="content">
                <SelectFilter v-model="param.companySeq" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span class="label">시험명</span>
              <div class="content">
                <q-input v-model="param.examName" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span class="label">등록자</span>
              <div class="content">
                <q-input v-model="param.regId" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
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
            class="q-mr-md"
          />
          <CustomButton label="검색" />
        </div>
      </q-card-section>
    </q-card>

    <div class="flex items-baseline edit-btn-wrap">
      <p class="q-mt-auto">총 <span class="list-count">3</span>개</p>
      <q-space />
      <CustomButton @click="$router.push('/examInfo/edit')" label="시험정보등록" />
    </div>

    <q-card flat>
      <q-table :rows="[1, 2, 3]" flat bordered hide-bottom>
        <template #header>
          <q-tr>
            <q-th style="width: 5%">번호</q-th>
            <q-th style="width: 20%">회사명</q-th>
            <q-th style="width: 20%">시험명</q-th>
            <q-th style="width: 15%">등록자</q-th>
            <q-th style="width: 20%">등록일(년/월/일)</q-th>
            <q-th style="width: 20%">관리</q-th>
          </q-tr>
        </template>
        <template #body>
          <q-tr>
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
            <q-td>
              <div class="row q-col-gutter-sm">
                <RowEditButton label="삭제" icon="delete" class="col-xs-12 col-md-6" />
                <RowEditButton label="수정" icon="edit" class="col-xs-12 col-md-6" />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <PaginationTemp v-model:page="param" />
    </q-card>
  </q-page>
</template>

<script setup>
const resetParam = () => {
  return {
    companySeq: '',
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
const param = ref({ ...resetParam() });
</script>

<route lang="yaml">
meta:
  layout: default
</route>
