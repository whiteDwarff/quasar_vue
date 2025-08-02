<template>
  <SurveyForm v-model="form" />
</template>

<script setup>
const form = ref({
  researchTitle: '',
  researchMemo: '',
  survey: [
    {
      reItemTitle: '',
      reItemNo: 1,
      reItemType: '1',
      useFlag: 'Y',
      reItemExample: [
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
