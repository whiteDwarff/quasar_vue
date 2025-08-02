<template>
  <SurveyForm v-model="form" />
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const form = ref({
  surveyCode: route.params?.surveyCode,
  title: '',
  memo: '',
  survey: [
    {
      title: '',
      type: 1,
      order: 1,
      example: [
        {
          value: '',
          order: 1,
        },
        {
          value: '',
          order: 2,
        },
      ],
    },
  ],
  currentOrder: 1,
});
const fetchedSurveyInfo = async () => {
  const { data, error } = await $fetchedSurveyInfo(route.params?.surveyCode);
  if (data && !error) {
    form.value = data;
  } else {
    await router.push('/assign/survey');
    $showAlert(error);
  }
};

fetchedSurveyInfo();
</script>

<route lang="yaml">
meta:
  params:
    surveyCode: number
</route>
