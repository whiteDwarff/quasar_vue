<template>
  <SubjectTreeForm
    @submit="submit"
    v-model="param"
    v-model:nodes="nodes"
    title="교과목분류"
  />
</template>

<script setup>

const { nodes, param, getSubjectCategory } = useSubjectCategory();

getSubjectCategory();

const submit = async () => {
  const { status, message } = await subjectCategoryEdit(nodes.value);
  if (status) {
    $showAlert('저장 성공하였습니다.');
    return await getSubjectCategory();
  } 
  $showAlert(message);
}
</script>
