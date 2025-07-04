<template>
  <LocationForm v-model="form" />
</template>

<script setup>
const route = useRoute();
const router = useRouter();
console.log($validNumber(route.params?.examRoomCode));

if (!$validNumber(route.params?.examRoomCode)) {
  router.push('/notFound');
}

const form = reactive({
  examRoomCode: route.params.examRoomCode,
  examRoomName: '', // 시험장
  examRoomLocation: '', // 시험지역
  examRoomAddr: '', // 시험장소
  examRoomInfo: '', // 시험정보
  mngr: '', // 담당자
  mngrTel: '', // 담당자 전화번호
  mngrInfo: '', // 담당자 정보
  examRoomNum: [],
});
</script>

<route lang="yaml">
meta:
  layout: default
</route>
