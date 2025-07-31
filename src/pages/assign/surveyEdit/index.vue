<template>
  <SurveyForm v-model="form" />
</template>

<script setup>
const form = ref({
  researchTitle: '',
  researchMemo: '',
  survey: [
    {
      title: '',
      type: 1,
      order: 1,
      useFlag: 'Y',
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
</script>
