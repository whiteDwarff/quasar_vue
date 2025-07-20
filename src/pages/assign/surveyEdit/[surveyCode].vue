<template>
  <SurveyForm v-model="form" />
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const form = ref({
  surveyCode: route.params.surveyCode,
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

if (!$validNumber(route.params?.surveyCode)) {
  router.push('/error');
}
</script>
