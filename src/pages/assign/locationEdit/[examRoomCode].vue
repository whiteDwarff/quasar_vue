<template>
  <LocationForm v-model="form" />
</template>

<script setup>
definePage({
  path: '/assign/locationEdit/:examRoomCode(\\d+)',
});

const router = useRouter();
const route = useRoute();

const { form, getLocation } = useLocationInfo();

getLocation(route.params.examRoomCode).then(async (status) => {
  if (!status) {
    await router.push('/assign/location');
    $showAlert('잘못된 접근입니다.');
  }
});
</script>
