/**
 * 교과목분류 조회
 * @returns {object} nodes - 목록
 * @returns {string} param - 검색조건
 * @returns {function} getSubjectCategory - 목록조회 함수
 */
export function useSubjectCategory() {
  const nodes = ref([]);
  const param = ref('');

  // 교과목분류 목록 요청
  const getSubjectCategory = async () => {
    try {
      const res = await axiosLoading.get('/assign/subjectCategory');

      if (res.data.status == 200) nodes.value = res.data.result.list;
    } catch (err) {
      console.error(err);
    }
  };

  return {
    nodes,
    param,
    getSubjectCategory,
  };
}
/**
 * 교과목분류 수정
 * @param {array} nodes - 등록 및 수정 데이터
 * @returns {Promise}
 */
export function subjectCategoryEdit(nodes) {
  const res = axiosLoading.post('/assign/subjectCategoryEdit', nodes);
  return handleApiCall(res);
}
export async function getSubjectCategoryByDepth(params, cateStep) {
  params = { ...params, cateStep };
  const res = await axios.get('/assign/subjectCategoryByDepth', { params });
  return res.data.status == 200 ? res.data.result.list : [];
}