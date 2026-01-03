<template>
  <SurveyForm v-model="form" />
</template>

<script setup>
definePage({
  path: '/assign/surveyEdit/:researchCode(\\d+)',
});

const route = useRoute();
const router = useRouter();

const { form, getServeyInfo } = useServeyInfo();

getServeyInfo(route.params.researchCode).then(async (status) => {
  if (!status) {
    await router.push('/servey');
    $showAlert('잘못된 접근입니다.');
  }
});
</script>
