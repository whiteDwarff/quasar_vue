<template>
  <ExamineeForm v-model="form" />
</template>

<script setup>
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
  // companySeq: '',
});
</script>
