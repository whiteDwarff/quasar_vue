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

      <q-card-section class="search-wrap">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span class="label">사번</span>
              <div class="content">
                <q-input v-model="param.examineeId" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span class="label">성명</span>
              <div class="content">
                <q-input v-model="param.examineeName" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
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
              <span class="label">사진유무</span>
              <div class="content">
                <q-select
                  v-model="param.imgYn"
                  :options="[
                    { label: '전체', value: '' },
                    { label: '사용', value: 'Y' },
                    { label: '미사용', value: 'N' },
                  ]"
                  outlined
                  dense
                  options-dense
                  emit-value
                  map-options
                />
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

    <div class="flex edit-btn-wrap">
      <p class="q-mt-auto">총 <span class="list-count">3</span>개</p>
      <q-space />
      <CustomButton @click="$router.push('/assign/edit')" label="응시자등록" />
      <CustomButton
        label="엑셀양식 다운로드"
        icon="bi-cloud-download"
        color="grey-6"
        outline
        class="q-mx-sm"
      />
      <CustomButton label="엑셀로 업로드" icon="bi-filetype-xlsx" color="positive" outline />
    </div>

    <q-card flat>
      <q-table :rows="[1, 2, 3]" flat bordered hide-bottom>
        <template #header>
          <q-tr>
            <q-th style="width: 5%">번호</q-th>
            <q-th style="width: 10%">사번(등록번호)</q-th>
            <q-th style="width: 20%">성명(국문)</q-th>
            <q-th style="width: 20%">성명(영문)</q-th>
            <q-th style="width: 20%">회사명</q-th>
            <q-th style="width: 5%">사진유무</q-th>
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
    examineeId: '',
    examineeName: '',
    companySeq: '',
    imgYn: '',
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
