
/**
 * 시험분류 조회
 * @returns {object} nodes - 목록
 * @returns {string} param - 검색조건
 * @returns {function} getExamCategory - 목록조회 함수
 */
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
/**
 * 시험분류 수정
 * @param {array} nodes - 등록 및 수정 데이터
 * @returns {Promise}
 */
export function examCategoryEdit(nodes) {
  const res = axiosLoading.post('/assign/examCategoryEdit', nodes);
  return handleApiCall(res);
}

export async function getExamCategoryByDepth(params, cateStep) {
  params = { ...params, cateStep };
  const res = await axios.get('/assign/examCategoryByDepth', { params });
  return res.data.status == 200 ? res.data.result.list : [];
}