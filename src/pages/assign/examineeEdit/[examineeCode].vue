<template>
  <ExamineeForm v-model="form" />
</template>

<script setup>
const router = useRouter();
const route = useRoute();

const form = ref({
  examineeId: '',
  examineePass: '',
  examineeName: '',
  examineeNameEn: '',
  examineeBirth: '',
  examineeGender: '1',
  examineePhone: '',
  examineeEmail: '',
  examineeCollege: '',
  examineeMajor: '',
  examineeImg: '',
  //companySeq: '',
});

const getExamineeInfo = async () => {
  const { data, error } = await $fetchedExamineeInfo(route?.params?.examineeCode);

  if (!error) form.value = data;
  else {
    await router.push('/assign/examinee');
    $showAlert(error);
  }
};
getExamineeInfo();
</script>

<route lang="yaml">
meta:
  params:
    examineeCode: number
</route>
