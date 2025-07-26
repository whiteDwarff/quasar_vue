<template>
  <ExamineeForm v-model="form" />
</template>

<script setup>
const route = useRoute();
const router = useRouter();

if (!$validString(route.params.examineeCode)) {
  router.push('/error');
}
const form = ref({
  examineeId: route.params?.examineeCode,
  examineeNameEn: '',
  examineeName: '',
  birth: '',
  email: '',
  tel: '',
  file: null,
  imagePath: '',
  //companySeq: '',
});
</script>
