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
                  class="bg-white"
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

    <div class="row q-col-gutter-y-sm edit-btn-wrap">
      <p class="q-mt-auto col-xs-12 col-md-1">
        총 <span class="list-count">{{ rows.length }}</span
        >개
      </p>
      <!-- <q-space /> -->
      <div class="col-xs-12 col-md-11 row q-col-gutter-sm justify-end">
        <CustomButton @click="$router.push('/assign/examineeEdit')" label="응시자등록" />
        <CustomButton
          @click="examineeDelete()"
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
            <q-th style="width: 5%">번호</q-th>
            <q-th style="width: 10%">사번(등록번호)</q-th>
            <q-th style="width: 25%">성명(국문)</q-th>
            <q-th style="width: 25%">성명(영문)</q-th>
            <!-- <q-th style="width: 20%">회사명</q-th> -->
            <q-th style="width: 7%">사진유무</q-th>
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
            <q-td> <q-checkbox v-model="props.selected" /></q-td>
            <q-td>{{ props.row.no }}</q-td>
            <q-td>{{ props.row.examineeId }}</q-td>
            <q-td>{{ props.row.examineeName }}</q-td>
            <q-td>{{ props.row.examineeNameEn }}</q-td>
            <!-- <q-td>{{ props.row.companyName }}</q-td> -->
            <q-td>{{ props.row.imageYn }}</q-td>
            <q-td>
              <div class="row q-col-gutter-sm">
                <RowEditButton
                  @click="examineeDelete(props.row)"
                  label="삭제"
                  icon="delete"
                  class="col-xs-12 col-md-6"
                />
                <RowEditButton
                  @click="$router.push(`/assign/examineeEdit/${props.row.examineeId}`)"
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

    <FileUploadDialog v-model="visible" url="test" />
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

const selected = ref([]);
const currentRow = ref(null);

const visible = ref(false);

const rows = ref([
  {
    no: 1,
    examineeSeq: 100,
    examineeId: 'rkdans113',
    examineeName: '강문호',
    examineeNameEn: 'Kang Mun ho',
    companyName: '토스',
    imageYn: '미사용',
  },
  {
    no: 2,
    examineeSeq: 101,
    examineeId: 'an6684',
    examineeName: '안민덩',
    examineeNameEn: 'An dung',
    companyName: '카카오',
    imageYn: '사용',
  },
]);

const examineeDelete = async (examinee = null) => {
  if (!selected.value.length && !examinee) return $showAlert('삭제할 응시자를 선택해주세요.');

  const status = await $showConfirm('응시자를 삭제하시겠습니까?');

  if (status) {
    // axios
    const arr = examinee ? [examinee] : selected.value;
    console.log(arr);
  }
};
</script>
