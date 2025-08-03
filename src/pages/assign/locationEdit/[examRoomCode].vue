<template>
  <LocationForm v-model="form" />
</template>

<script setup>
const router = useRouter();
const route = useRoute();

const form = ref({
  examRoomCode: route.params.examRoomCode,
  examRoomName: '', // 시험장
  examRoomLocation: '', // 시험지역
  examRoomAddr: '', // 시험장소
  examRoomInfo: '', // 시험정보
  examroomCharge: '', // 담당자
  examroomPhone: '', // 담당자 전화번호
  examroomChargeInfo: '', // 담당자 정보
  tbExamroomNumInfo: [],
});

const fetchedLocationInfo = async () => {
  const { data, error } = await $fetchedLocationInfo(route.params.examRoomCode);

  if (!error) form.value = data;
  else {
    await router.push('/assign/location');
    $showAlert(error);
  }
};
fetchedLocationInfo();
</script>

<route lang="yaml">
meta:
  params:
    examRoomCode: number
</route>
