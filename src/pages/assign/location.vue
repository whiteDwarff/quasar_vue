<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">장소관리</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">배정관리</span>
          <span class="current">장소관리</span>
        </div>
      </q-card-section>

      <q-card-section class="search-wrap">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">시험장</span>
              <div class="content">
                <q-input v-model="param.examRoomLocation" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-4">
            <div class="flex items-center">
              <span class="label">시험지역</span>
              <div class="content">
                <q-input v-model="param.examRoomName" outlined dense class="bg-white" />
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
        <CustomButton
          @click="locationDelete(null)"
          label="삭제"
          color="warning"
          outline
          class="q-mr-sm w-100"
        />
        <CustomButton @click="$router.push('/assign/locationEdit')" label="장소등록" />
      </div>
    </div>

    <q-card flat>
      <q-table
        v-model:selected="selected"
        :rows="rows"
        selection="multiple"
        row-key="examRoomCode"
        flat
        bordered
        hide-pagination
        hide-selected-banner
      >
        <template #header="props">
          <q-tr :props="props">
            <q-th style="width: 5%">
              <!-- <q-checkbox @update:model-value="toggleSelected" v-model="isAll" /> -->
              <q-checkbox v-model="props.selected" />
            </q-th>
            <q-th style="width: 5%">번호</q-th>
            <q-th style="width: 20%">시험장</q-th>
            <q-th style="width: 20%">시험지역</q-th>
            <q-th style="width: 30%">시험장소</q-th>
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
              <q-checkbox v-model="props.selected" />

              <!-- <q-checkbox
                v-if="!props.row.usedCount"
                @update:modelValue="changeCheckedVal"
                v-model="selected"
                :val="props.row"
              /> -->
            </q-td>
            <q-td>{{ props.row.no }}</q-td>
            <q-td>{{ props.row.examRoomLocation }}</q-td>
            <q-td>{{ props.row.examRoomName }}</q-td>
            <q-td>{{ props.row.examRoomAddr }}</q-td>
            <q-td>
              <div class="row q-col-gutter-sm">
                <RowEditButton
                  @click="locationDelete(props.row)"
                  label="삭제"
                  icon="delete"
                  class="col-xs-12 col-md-6"
                />
                <RowEditButton
                  @click="$router.push(`/assign/locationEdit/${props.row.examRoomCode}`)"
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
    examRoomLocation: '',
    examRoomName: '',
    current: 1,
    min: 1,
    max: 1,
  };
};
const param = ref({ ...resetParam() });

const selected = ref([]);
// const isAll = ref(false);
const currentRow = ref(null);

const rows = ref([
  {
    no: 1,
    examRoomCode: 100,
    examRoomLocation: '교육용 CBT실',
    examRoomName: '401호',
    examRoomAddr: '교육동 4층',
    usedCount: 0,
  },
  {
    no: 2,
    examRoomCode: 101,
    examRoomLocation: 'ㄴㅇㄴ',
    examRoomName: '201호',
    examRoomAddr: '진리관 2층',
    usedCount: 0,
  },
]);
/*
// 테이블 row의 checkbox 선택
const changeCheckedVal = (event) => {
  isAll.value = rows.value.filter((row) => !row.usedCount).length == event.length;
};
// 삭제 가능한 항목 제외 전체 선택
const toggleSelected = (event) => {
  if (event) {
    selected.value = rows.value.filter((row) => !row.usedCount);
    return;
  }
  isAll.value = false;
  selected.value = [];
};
*/
// 장소삭제
const locationDelete = async (survey) => {
  if (!survey && !selected.value.length) return $showAlert('삭제할 항목을 선택해주세요.');

  if (await $showConfirm('삭제하시겠습니까?')) {
    $showAlert('삭제되었습니다.');
    /*
    try {
      const res = $axios_loading.post('', {
        selected: [ survey ? survey : ...selected.value ]
      });

      if(res.data.status == 200) {
        $showAlert('삭제되었습니다.');
        return router.push('/assign/survey');
      }  
      $showAlert('삭제 실패하였습니다.');
    } catch(err) {
      console.log(err);
    }
    */
  }
};
</script>
