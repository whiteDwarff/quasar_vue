<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">시험정보등록</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">시험정보</span>
          <span class="current">시험정보등록</span>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md-6">
            <table class="markup-table">
              <colgroup>
                <col width="20%" />
                <col width="80%" />
              </colgroup>
              <tbody>
                <tr>
                  <th class="star">시험장</th>
                  <td><q-input outlined dense fill class="full-width" /></td>
                </tr>
                <tr>
                  <th>시험지역</th>
                  <td><q-input outlined dense fill class="full-width" /></td>
                </tr>
                <tr>
                  <th class="star">시험장소</th>
                  <td><q-input outlined dense fill class="full-width" /></td>
                </tr>
                <tr>
                  <th>시험정보</th>
                  <td>
                    <q-input v-model="form.examRoomInfo" dense outlined type="textarea" rows="5">
                      <template v-if="form.examRoomInfo" v-slot:append>
                        <q-icon
                          name="cancel"
                          color="grey-5"
                          @click="form.examRoomInfo = ''"
                          class="cursor-pointer full-height"
                        />
                      </template>
                    </q-input>
                  </td>
                </tr>
                <tr>
                  <th>담당자</th>
                  <td><q-input outlined dense fill class="full-width" /></td>
                </tr>
                <tr>
                  <th>담당자<br />전화번호</th>
                  <td><q-input outlined dense fill mask="###-####-####" class="full-width" /></td>
                </tr>
                <tr>
                  <th>담당자 정보</th>
                  <td>
                    <q-input v-model="form.examRoomInfo" dense outlined type="textarea" rows="5">
                      <template v-if="form.examRoomInfo" v-slot:append>
                        <q-icon
                          name="cancel"
                          color="grey-5"
                          @click="form.examRoomInfo = ''"
                          class="cursor-pointer full-height"
                        />
                      </template>
                    </q-input>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-xs-12 col-md-6">
            <table class="markup-table">
              <colgroup>
                <col width="20%" />
                <col width="30%" />
                <col width="20%" />
                <col width="30%" />
              </colgroup>
              <tbody>
                <tr>
                  <th class="star">호실</th>
                  <td>
                    <q-input
                      v-model="form.roomNumber"
                      outlined
                      dense
                      fill
                      suffix="호"
                      input-class="text-right"
                      class="full-width"
                    />
                  </td>
                  <th>정원</th>
                  <td>
                    <q-input
                      :model-value="updateExamineeCount(form.colCount, form.rowCount)"
                      input-class="text-right"
                      suffix="명"
                      outlined
                      dense
                      fill
                      readonly
                      class="full-width"
                    />
                  </td>
                </tr>
                <tr>
                  <th class="star">자리<br />배치구성</th>
                  <td colspan="3">
                    <div class="flex items-center">
                      <div style="width: 46%">
                        <q-input
                          v-model="form.colCount"
                          input-class="text-right"
                          prefix="가로 :"
                          suffix="명"
                          dense
                          outlined
                          mask="####"
                        />
                      </div>
                      <span class="input-label block text-center" style="width: 8%">×</span>
                      <div style="width: 46%">
                        <q-input
                          v-model="form.rowCount"
                          input-class="text-right"
                          prefix="세로 :"
                          suffix="명"
                          dense
                          outlined
                          mask="####"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="flex q-my-sm">
              <q-space />
              <CustomButton
                @click="resetExamRoomNum"
                label="초기화"
                :outline="true"
                class="q-mr-md"
              />
              <CustomButton @click="addExamRoomNum" label="추가" />
            </div>

            <q-table
              :rows="form.examRoomNum"
              row-key="roomNumberOri"
              flat
              hide-pagination
              :class="{ 'table-height': form.examRoomNum.length }"
            >
              <template #header>
                <q-tr>
                  <q-th auto-width />
                  <q-th>호실</q-th>
                  <q-th>정원</q-th>
                  <q-th>자리배치구성</q-th>
                  <q-th>관리</q-th>
                </q-tr>
              </template>
              <!-- body -->
              <template v-slot:body="props">
                <q-tr :props="props" no-hover>
                  <q-td style="width: 5%">
                    <q-btn
                      @click="props.expand = !props.expand"
                      :icon="
                        props.expand ? 'sym_o_keyboard_arrow_down' : 'sym_o_keyboard_arrow_right'
                      "
                      :ripple="false"
                      round
                      size="sm"
                      color="grey-7"
                      outline
                      unelevated
                      class="rounded-50"
                    />
                  </q-td>
                  <q-td style="width: 20%"> {{ props.row.roomNumberOri }}호</q-td>
                  <q-td style="width: 20%"
                    >{{ props.row.rowCountOri * props.row.colCountOri }}명</q-td
                  >
                  <q-td style="width: 40%">
                    {{ props.row.colCountOri }} × {{ props.row.rowCountOri }}명<br />
                    <small>(가로 × 세로)</small>
                  </q-td>
                  <q-td style="width: 15%">
                    <q-btn
                      @click="exceptExamItem(i)"
                      icon="bi-trash3"
                      round
                      flat
                      :ripple="false"
                      color="grey-14"
                      size="sm"
                      class="fit"
                    />
                  </q-td>
                </q-tr>
                <!-- expand -->
                <q-tr
                  v-show="props.expand"
                  :props="props"
                  style="background-color: #f2f7ff"
                  no-hover
                >
                  <q-td class="border-bottom-none"> </q-td>
                  <q-td class="border-bottom-none">
                    <q-input
                      @input.prevent="props.expand = true"
                      v-model="props.row.roomNumber"
                      label="호실"
                      bg-color="white"
                      dense
                      outlined
                    />
                  </q-td>
                  <q-td class="border-bottom-none">
                    <q-input
                      :modelValue="updateExamineeCount(props.row.colCount, props.row.rowCount)"
                      label="정원"
                      bg-color="white"
                      dense
                      outlined
                      mask="####"
                      readonly
                    />
                  </q-td>
                  <q-td class="border-bottom-none">
                    <div class="row q-col-gutter-xs">
                      <q-input
                        v-model="props.row.colCount"
                        class="col-6"
                        label="가로"
                        bg-color="white"
                        dense
                        outlined
                        mask="####"
                      />
                      <q-input
                        v-model="props.row.rowCount"
                        class="col-6"
                        label="세로"
                        bg-color="white"
                        dense
                        outlined
                        mask="####"
                      />
                    </div>
                  </q-td>
                  <q-td class="border-bottom-none">
                    <q-btn
                      @click="updateRoomNumInfo($event, props, true)"
                      label="수정"
                      color="primary"
                      outline
                      class="bg-white"
                    />
                  </q-td>
                </q-tr>
                <q-tr
                  v-show="props.expand"
                  :props="props"
                  style="background-color: #f2f7ff"
                  no-hover
                >
                  <q-td />
                  <q-td colspan="4">
                    <q-input
                      v-model="props.row.examRoomInfo"
                      label="호실정보"
                      bg-color="white"
                      dense
                      outlined
                    />
                  </q-td>
                </q-tr>
              </template>
              <!-- empty  -->
              <template v-slot:no-data>
                <div class="full-width text-center">데이터가 없습니다.</div>
              </template>
            </q-table>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const form = ref({
  examRoomInfo: '',

  roomNumber: '',
  colCount: '',
  rowCount: '',

  //
  examRoomNum: [
    {
      roomNumber: '2412',
      colCount: 3,
      rowCount: 4,
      examRoomNumInfo: '집임',
      roomNumberOri: '2412',
      colCountOri: 3,
      rowCountOri: 4,
    },
  ],
});

// 자리 배치구성 입력 시
const updateExamineeCount = (value1, value2) => {
  const colCount = parseInt(value1);
  const rowCount = parseInt(value2);

  return !isNaN(colCount) && !isNaN(rowCount) ? colCount * rowCount : null;
};
// 호실정보 추가
const addExamRoomNum = async () => {
  const { roomNumber, colCount, rowCount } = form.value;
  if (!roomNumber) return $showAlert('호실을 입력하세요.');

  for (let item of form.value.examRoomNum) {
    if (item.roomNumberOri == roomNumber) return $showAlert('동일한 호실이 존재합니다.');
  }

  if (!colCount) return $showAlert('가로 인원을 입력하세요.');
  if (!rowCount) return $showAlert('새로 인원을 입력하세요.');

  if (await $showConfirm('호실정보를 추가하시겠습니까?')) {
    form.value.examRoomNum.push({
      roomNumber,
      colCount,
      rowCount,
      examRoomInfo: '',
      roomNumberOri: roomNumber,
      colCountOri: colCount,
      rowCountOri: rowCount,
    });
    resetExamRoomNum();
  }
};
// 호실정보 초기화
const resetExamRoomNum = () => {
  form.value.roomNumber = '';
  form.value.exmaineeCount = null;
  form.value.colCount = '';
  form.value.rowCount = '';
};
</script>

<style scoped>
.table-height {
  height: 337px;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>
