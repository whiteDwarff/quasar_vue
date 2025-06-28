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
                    <q-input v-model="form.examRoomInfo" dense outlined type="textarea" rows="3">
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
                    <q-input v-model="form.examRoomInfo" dense outlined type="textarea" rows="3">
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
                    <q-input outlined dense fill readonly class="full-width" />
                  </td>
                </tr>
                <tr>
                  <th class="star">자리<br />배치구성</th>
                  <td colspan="3">
                    <div class="flex items-center">
                      <div style="width: 46%">
                        <q-input
                          input-class="text-right"
                          prefix="가로 :"
                          suffix="명"
                          dense
                          outlined
                          mask="####"
                        />
                      </div>
                      <span class="q-mx-sm input-label block text-center" style="width: 4%">X</span>
                      <div style="width: 46%">
                        <q-input
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
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const form = ref({
  examRoomInfo: '',
});

/*
const router = useRouter();

const form = ref({
  examRoomCode: 1,
  companySeq: 10,
  addr: '',
  detailAddr: '',
  extraAddr: '',
  examRoomName: '우리집',
  examRoomAddr: '2412호',
  examRoomInfo: '',
  manager: '강문호',
  managerTel: '010-8637-1685',
  managerInfo: 'ㅎㅇ',
  roomNumber: '',
  personnelCount: '',
  rowCount: '',
  colCount: '',
  examRoomNumInfo: '',
  examRoomNum: [
    {
      examRoomCode: 1001,
      roomNumber: '2412',
      personnelCount: 14,
      rowCount: 2,
      colCount: 7,
      examRoomNumInfo: '우리집',
    },
    {
      examRoomCode: 1002,
      roomNumber: '1301',
      personnelCount: 6,
      rowCount: 3,
      colCount: 2,
      examRoomNumInfo: '',
    },
  ],
  min: 1,
  max: 1,
  maxPages: 1,
  current: 1,
});

const examRoomSubmit = async () => {
  if (!confirm('저장하시겠습니까?')) return;

  // api.post('...');

  alert('저장되었습니다.');
  router.push('/examinee/examRoomList');
};

const examRoomNumSubmit = async () => {
  const personnelCount = form.value.personnelCount;
  const totalCount = form.value.rowCount * form.value.colCount;

  if (totalCount > personnelCount) return alert('배치한 인원의 수가 정원 수보다 큽니다.');

  if (confirm('저장하시겠습니까?')) {
    try {
      // const res =  await api.post('...');

      form.value.examRoomNum.unshift({
        examRoomCode: Math.floor(Math.random() * 100),
        roomNumber: form.value.roomNumber,
        personnelCount: form.value.personnelCount,
        rowCount: form.value.rowCount,
        colCount: form.value.colCount,
        examRoomNumInfo: form.value.examRoomNumInfo,
      });

      form.value.roomNumber = '';
      form.value.personnelCount = '';
      form.value.rowCount = '';
      form.value.colCount = '';
      form.value.examRoomNumInfo = '';
    } catch (err) {
      console.log(err);
    }
  }
};

// 선택한 호실 삭제
const deleteExamRoomNum = async (row) => {
  try {
    // const res =  await api.post('...');
    form.value.examRoomNum = form.value.examRoomNum.filter(
      ({ examRoomCode }) => examRoomCode != row.examRoomCode,
    );
    alert('삭제되었습니다.');
  } catch (err) {
    console.log(err);
  }
};
// 선택한 호실 수정
const updateExamRoomNum = async (row) => {
  try {
    // const res =  await api.post('...');
    alert('수정되었습니다.');
  } catch (err) {
    console.log(err);
  }
};
*/
</script>
<route lang="yaml">
meta:
  layout: default
</route>
