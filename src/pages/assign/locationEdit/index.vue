<template>
  <LocationForm v-model="form" />
</template>

<script setup>
const form = reactive({
  examRoomName: '', // 시험장
  examRoomLocation: '', // 시험지역
  examRoomAddr: '', // 시험장소
  examRoomInfo: '', // 시험정보
  examroomCharge: '', // 담당자
  examroomPhone: '', // 담당자 전화번호
  examroomChargeInfo: '', // 담당자 정보
  tbExamroomInfo: [],
});
</script>
