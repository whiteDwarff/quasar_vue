
export function useExamCategory() {
  const nodes = ref([]);
  const param = ref('');

  // 시험분류 목록 요청
  const getExamCategory = async () => {
    try {
      const res = await axiosLoading.get('/assign/examCategory');

      if (res.data.status == 200) nodes.value = res.data.result.list;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    nodes,
    param,
    getExamCategory,
  };
}