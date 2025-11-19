<template>
  <ExamineeForm v-model="form" />
</template>

<script setup>
const router = useRouter();
const route = useRoute();

const { form, getExamineeInfo } = useExamineeInfo();

getExamineeInfo(route?.params?.examineeCode).then(async (status) => {
  if (!status) {
    await router.push('/assign');
    $showAlert('잘못된 접근입니다.');
  }
});
</script>

<route lang="yaml">
meta:
  params:
    examineeCode: number
</route>
