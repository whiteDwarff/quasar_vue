<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">장소등록</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">배정관리</span>
          <span class="current">장소등록</span>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md-6">
            <p class="text-subtitle2 text-weight-bold q-mb-md before-line">시험장 등록</p>
            <table class="markup-table">
              <colgroup>
                <col width="20%" />
                <col width="80%" />
              </colgroup>
              <tbody>
                <tr>
                  <th class="star">시험장</th>
                  <td>
                    <q-input v-model="form.examroomName" outlined dense fill class="full-width" />
                  </td>
                </tr>
                <tr>
                  <th>시험지역</th>
                  <td>
                    <q-input
                      v-model="form.examroomLocation"
                      outlined
                      dense
                      fill
                      class="full-width"
                    />
                  </td>
                </tr>
                <tr>
                  <th class="star">시험장소</th>
                  <td>
                    <q-input v-model="form.examroomAddr" outlined dense fill class="full-width" />
                  </td>
                </tr>
                <tr>
                  <th>시험정보</th>
                  <td>
                    <q-input v-model="form.examroomInfo" dense outlined type="textarea" rows="5">
                      <template v-if="form.examroomInfo" v-slot:append>
                        <q-icon
                          name="cancel"
                          color="grey-5"
                          @click="form.examroomInfo = ''"
                          class="cursor-pointer full-height"
                        />
                      </template>
                    </q-input>
                  </td>
                </tr>
                <tr>
                  <th>담당자</th>
                  <td>
                    <q-input v-model="form.examroomCharge" outlined dense fill class="full-width" />
                  </td>
                </tr>
                <tr>
                  <th>담당자<br />전화번호</th>
                  <td>
                    <q-input
                      v-model="form.examroomPhone"
                      outlined
                      dense
                      fill
                      mask="###-####-####"
                      class="full-width"
                    />
                  </td>
                </tr>
                <tr>
                  <th>담당자 정보</th>
                  <td>
                    <q-input
                      v-model="form.examroomChargeInfo"
                      dense
                      outlined
                      type="textarea"
                      rows="5"
                    >
                      <template v-if="form.examroomChargeInfo" v-slot:append>
                        <q-icon
                          name="cancel"
                          color="grey-5"
                          @click="form.examroomChargeInfo = ''"
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
            <p class="text-subtitle2 text-weight-bold q-mb-md before-line">호실 등록</p>
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
                      v-model="roomInfo.examroomNumName"
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
                      :model-value="
                        updateExamineeCount(roomInfo.examroomNumCol, roomInfo.examroomNumRow)
                      "
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
                          v-model="roomInfo.examroomNumCol"
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
                          v-model="roomInfo.examroomNumRow"
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
              <CustomButton @click="addExamRoomNum(roomInfo)" label="추가" />
            </div>

            <q-table
              :rows="form.tbExamroomInfo"
              row-key="key"
              flat
              hide-pagination
              :class="{ 'table-height': form.tbExamroomInfo.length }"
              style="min-height: 86px"
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
                  <q-td style="width: 20%"> {{ props.row.examroomNumNameOri }}호</q-td>
                  <q-td style="width: 20%"
                    >{{ props.row.examroomNumRowOri * props.row.examroomNumColOri }}명</q-td
                  >
                  <q-td style="width: 40%">
                    {{ props.row.examroomNumColOri }} × {{ props.row.examroomNumRowOri }}명<br />
                    <small>(가로 × 세로)</small>
                  </q-td>
                  <q-td style="width: 15%">
                    <q-btn
                      @click="exceptRoomInfo(props.rowIndex)"
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
                      v-model="props.row.examroomNumName"
                      label="호실"
                      bg-color="white"
                      dense
                      outlined
                    />
                  </q-td>
                  <q-td class="border-bottom-none">
                    <q-input
                      :modelValue="
                        updateExamineeCount(props.row.examroomNumCol, props.row.examroomNumRow)
                      "
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
                        v-model="props.row.examroomNumCol"
                        class="col-6"
                        label="가로"
                        bg-color="white"
                        dense
                        outlined
                        mask="####"
                      />
                      <q-input
                        v-model="props.row.examroomNumRow"
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
                      @click="updateExamRoomNum(props.row, props.rowIndex)"
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
                      v-model="props.row.examroomNumInfo"
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
      <q-card-section class="flex justify-center">
        <CustomButton @click="cancle()" label="취소" outline class="w-100 q-mr-lg" />
        <CustomButton @click="submit()" label="저장" class="w-100" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const router = useRouter();

const form = defineModel();

// 호실 정보
const roomInfo = ref({
  examroomNumName: '',
  examroomNumCol: '',
  examroomNumRow: '',
});

// 자리 배치구성 입력 시
const updateExamineeCount = (value1, value2) => {
  const examroomNumCol = parseInt(value1);
  const examroomNumRow = parseInt(value2);

  return !isNaN(examroomNumCol) && !isNaN(examroomNumRow) ? examroomNumCol * examroomNumRow : null;
};
// 호실정보 유효성 검사
const validRoomInfo = (obj, i = null) => {
  const { examroomNumName, examroomNumCol, examroomNumRow } = obj;

  if (!examroomNumName) return $showAlert('호실을 입력하세요.');

  const target = form.value.tbExamroomInfo.find((item, j) => {
    if (i != null) {
      if (i != j && item.examroomNumNameOri == examroomNumName) return item;
    } else {
      if (item.examroomNumNameOri == examroomNumName) return item;
    }
  });

  if (target) return $showAlert('동일한 호실이 존재합니다.');

  if (!examroomNumCol) return $showAlert('가로 인원을 입력하세요.');
  if (!examroomNumRow) return $showAlert('새로 인원을 입력하세요.');

  return true;
};
// 호실정보 추가
const addExamRoomNum = async (obj) => {
  if (validRoomInfo(obj)) {
    const { examroomNumName, examroomNumCol, examroomNumRow } = obj;

    if (await $showConfirm('호실정보를 추가하시겠습니까?')) {
      form.value.tbExamroomInfo.push({
        key: crypto.randomUUID(),
        examroomNumName,
        examroomNumCol,
        examroomNumRow,
        examroomNumInfo: '',
        useFlag: 'Y',
        examroomNumNameOri: examroomNumName,
        examroomNumColOri: examroomNumCol,
        examroomNumRowOri: examroomNumRow,
      });
      resetExamRoomNum();
    }
  }
};
// 호실정보 수정
const updateExamRoomNum = (obj, i) => {
  if (validRoomInfo(obj, i)) {
    const { examroomNumName, examroomNumCol, examroomNumRow } = obj;

    for (let j in form.value.tbExamroomInfo)
      if (i == j) {
        form.value.tbExamroomInfo[j].examroomNumNameOri = examroomNumName;
        form.value.tbExamroomInfo[j].examroomNumColOri = examroomNumCol;
        form.value.tbExamroomInfo[j].examroomNumRowOri = examroomNumRow;
      }
  }
};
// 호실 삭제
const exceptRoomInfo = (i) => {
  if (form.value.tbExamroomInfo.length == 1) return $showAlert('하나의 호실은 등록되어야합니다.');
  else {
    form.value.tbExamroomInfo = form.value.tbExamroomInfo.filter((item, j) => i != j);
  }
};
// 호실정보 초기화
const resetExamRoomNum = () => {
  roomInfo.value.examroomNumName = '';
  roomInfo.value.examroomNumCol = '';
  roomInfo.value.examroomNumRow = '';
};
// 취소 후 목록으로 이동
const cancle = async () => {
  if (await $showConfirm('취소하시겠습니까?')) router.push('/assign/location');
};
// 저장
const submit = async () => {
  if (!form.value.examroomName) return $showAlert('시험장을 입력해주세요.');
  if (!form.value.examroomAddr) return $showAlert('시험장소를 입력해주세요.');

  if (!form.value.tbExamroomInfo.length) return $showAlert('하나의 호실은 등록되어야합니다.');

  if (await $showConfirm('저장하시겠습니까?')) {
    const { data, error } = await $saveLocationInfo(form.value);
    console.log(data, error);
    if (!error) {
      await router.push('/assign/location');
      $showAlert('저장되었습니다.');
    } else $showAlert(error);
  }
};
</script>

<style scoped>
.table-height {
  height: 337px;
}
</style>
