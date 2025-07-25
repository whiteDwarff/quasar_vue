<template>
  <ExamForm v-model="form" />
</template>

<script setup>
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
      useFlag: 'Y',
    },
  ],
});
</script>
