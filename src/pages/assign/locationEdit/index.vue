<template>
  <q-card flat dense>
    <!--
      <div class="row q-col-gutter-lg">
        <q-form @submit.prevent="examRoomSubmit" class="col-12 col-md-6">
          <ExamRoom v-model="form" :options="companyOptions" />
        </q-form>
        <q-form @submit.prevent="examRoomNumSubmit" class="col-12 col-md-6">
          <ExamRoomNum
          v-model="form"
          @update:examRoomNum="updateExamRoomNum"
          @delete:examRoomNum="deleteExamRoomNum"
          />
        </q-form>
      </div>
      -->
  </q-card>
</template>

<script setup>
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
