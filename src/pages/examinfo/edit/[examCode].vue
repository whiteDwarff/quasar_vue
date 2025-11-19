<template>
  <ExamForm v-model="form" />
</template>

<script setup>
definePage({
  path: '/examInfo/edit/:examCode(\\d+)',
});

const route = useRoute();
const router = useRouter();

const { form, getExamInfo } = useExamInfo();

getExamInfo(route?.params?.examCode).then(async (status) => {
  if (!status) {
    await router.push('/examInfo');
    $showAlert('잘못된 접근입니다.');
  }
});
</script>
