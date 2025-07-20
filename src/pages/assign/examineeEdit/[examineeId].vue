<template>
  <ExamineeForm v-model="form" />
</template>

<script setup>
const route = useRoute();
const router = useRouter();

if (!$validString(route.params.examineeId)) {
  router.push('/error');
}
const form = ref({
  examineeId: route.params?.examineeId,
  examineeNameEn: '',
  examineeName: '',
  companySeq: '',
  birth: '',
  email: '',
  tel: '',
  file: null,
  imagePath: '',
});
</script>
