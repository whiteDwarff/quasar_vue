<template>
  <ExamForm v-model="form" />
</template>

<script setup>
const route = useRoute();

const form = ref({
  // companySeq: '',
  examName: '',
  tbExamFormInfo: [
    {
      examFormName: '',
      examMethod: 'UBT',
      examTotalTime: '',
      personalInfoUseFlag: 'N',
      personalInfoMessage: '',
    },
  ],
});

// 시험목록 호출
const getExamInfo = async () => {
  const { data, error } = await $fetchedExamInfo(route?.params?.examCode);

  if (!error) {
    console.log(data);
    form.value = data;
  } else $showAlert('데이터 조회 실패하였습니다.');
};

getExamInfo();
</script>

<route lang="yaml">
meta:
  params:
    examCode: number
</route>
