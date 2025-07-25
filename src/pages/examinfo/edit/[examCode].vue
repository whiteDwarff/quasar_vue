<template>
  <ExamForm v-model="form" />
</template>

<script setup>
const router = useRouter();
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

  if (error) {
    await router.push('/examInfo');
    return $showAlert(error);
  }
  form.value = data;
};

getExamInfo();
</script>

<route lang="yaml">
meta:
  params:
    examCode: number
</route>
