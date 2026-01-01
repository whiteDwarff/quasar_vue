<template>
  <SubjectTreeForm
    @submit="submit" 
    v-model="param" 
    v-model:nodes="nodes" 
    title="시험분류"
  />
</template>

<script setup>
const { nodes, param, getExamCategory } = useExamCategory();

getExamCategory();

const submit = async () => {
  const { status, message } = await examCategoryEdit(nodes.value);
  if (status) {
    $showAlert('저장 성공하였습니다.');
    return await getExamCategory();
  } 
  $showAlert(message);
}
</script>
