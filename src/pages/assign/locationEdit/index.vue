<template>
  <LocationForm v-model="form" />
</template>

<script setup>
const form = reactive({
  examroomName: '', // 시험장
  examroomLocation: '', // 시험지역
  examroomAddr: '', // 시험장소
  examroomInfo: '', // 시험정보
  examroomCharge: '', // 담당자
  examroomPhone: '', // 담당자 전화번호
  examroomChargeInfo: '', // 담당자 정보
  tbExamroomNumInfo: [],
});
</script>
