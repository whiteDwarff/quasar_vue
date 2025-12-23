const store = useSystemStore();

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

  const filteredNodes = computed(() => {
    if (!param.value) {
      return nodes.value;
    }
    return filterNodes(nodes.value, param.value);
  });

  return {
    nodes, // 실제 데이터
    filterNodes: filteredNodes, // 검색용 노드 데이터
    param,
    getExamCategory,
  };
}
// 부모-자식 유지하면서 필터링 (useFlag='Y'인 노드만)
function filterNodes(nodesArr, keyword) {
  const filt = keyword.toLowerCase();
  return nodesArr
    .map((node) => {
      const matched = node.name.toLowerCase().includes(filt);

      let filteredChildren = [];
      if (node.children && node.children.length > 0) {
        filteredChildren = filterNodes(node.children, keyword);
      }
      // 부모가 매칭되면 자식 전부 유지
      if (matched) {
        return {
          ...node,
          children: node.children ? node.children.map((child) => ({ ...child })) : [],
        };
      }

      // 부모는 불일치하나 자식 중 일부가 매칭되면 매칭된 자식만 유지
      if (filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
        };
      }

      return null;
    })
    .filter((n) => n !== null);
}

/**
 * insert 공통처리 함수
 * @param {object | array} values
 * @returns object
 */
async function insertExamCategory(values) {
  let query = supabase
    .from('tb_exam_cate_info')
    .insert(camelToSnakeByObj(values))
    .select('cate_code');

  // 객체이거나, 배열인 경우 legngth가 1일때는 하나만 조회
  if (!Array.isArray(values) || (!Array.isArray(values) && values.length == 1))
    query = query.single();

  const { data, error } = await query;

  return { data, error };
}
/**
 * 신규등록인 2depth ~ 3depth까지 저장
 * @param {object} inserValue
 * @param {object} obj
 * @returns object
 */
async function insertExamCategoryChilds(inserValue, obj) {
  const { data, error } = await insertExamCategory({
    ...inserValue,
    cateStep: 2,
  });

  if (error) return { error };

  // 3depth의 경우 일괄 insert
  const lowRows = await Promise.all(
    obj.children.map(async (child) => ({
      parentCode: inserValue.parentCode,
      sub1Code: data.cate_code,
      cateName: child.cateName,
      cateStep: 3,
    })),
  );
  if (!lowRows.length) return { error: null };

  const { error: lowErr } = await insertExamCategory(lowRows);

  return {
    error: lowErr ? lowErr : null,
  };
}
/**
 * 1depth의 cateCode가 존재할 경우 하위 카테고리를 순회하며 등록, 수정
 * @param {object} row
 * @returns object
 */
async function upsertExamCategory(row) {
  let insertArr = []; // 등록 배열
  let updateArr = []; // 수정 배열
  const updtDt = $getNowString(); // 수정시간

  // 1depth 추가
  updateArr.push({
    cateCode: row.cateCode,
    cateName: row.cateName,
    updtDt,
  });

  // 2depth
  for (let mid of row.children) {
    // cateCode가 있는 경우 수정
    if (mid?.cateCode) {
      updateArr.push({
        cateCode: mid.cateCode,
        cateName: mid.cateName,
        updtDt,
      });
      for (let low of mid.children) {
        // 3depth update
        if (low?.cateCode) {
          updateArr.push({
            cateCode: low.cateCode,
            cateName: low.cateName,
            updtDt,
          });
          // 3depth insert
        } else {
          insertArr.push({
            parentCode: mid.parentCode,
            sub1Code: mid.cateCode,
            cateName: low.cateName,
          });
        }
      }
      // 2depth ~ 3depth insert
    } else {
      const { error } = await insertExamCategoryChilds(
        {
          cateName: mid.cateName,
          parentCode: mid.parentCode,
        },
        mid,
      );

      if (error) return { error };
    }
  }
  // 등록
  const { error: insertError } = await insertExamCategory(insertArr);
  // 수정
  const { error: updateError } = await supabase
    .from('tb_exam_cate_info')
    .upsert(camelToSnakeByObj(updateArr));

  return !insertError && !updateError
    ? { error: null }
    : {
        error: {
          ...insertError,
          ...updateError,
        },
      };
}

// 카테고리 저장
export async function $saveCateInfo(form) {
  try {
    store.setLoading(true);
    for (let top of form.selected) {
      if (!top?.cateCode) {
        const { cateName, cateStep } = top;
        // 1depth 저장
        const { data: topRes, error: topErr } = await insertExamCategory({ cateName, cateStep });
        if (topErr) return getErrorMessage[topErr.code] || '저장 실패하였습니다.';
        // 2, 3depth 저장
        for (let mid of top.children) {
          const { error } = await insertExamCategoryChilds(
            {
              parentCode: topRes.cate_code,
              cateName: mid.cateName,
              cateStep: 2,
            },
            mid,
          );
          if (error) return getErrorMessage[error.code] || '저장 실패하였습니다.';
        }

        // 수정
      } else {
        const { error } = await upsertExamCategory(top);
        if (error) return getErrorMessage[error.code] || '저장 실패하였습니다.';
      }
    }
    // 삭제목록 useFlag 변경
    if (form.except.length) $updateExamCategoryUsyn(form.except);
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}
/**
 * 시험분류 목록 조회
 * @returns object
 */
export async function $fetchedCateInfo() {
  try {
    store.setLoading(true);

    let { data, error } = await supabase
      .from('tb_exam_cate_info')
      .select('cate_code, cate_name, parent_code, sub1_code, cate_step, use_flag')
      .eq('use_flag', 'Y')
      .order('cate_code', { ascending: true }); // 내림차순 정렬

    const expand = [];

    if (!error) {
      data = snakeToCamelByObj(data);
      const topNodes = getCategoryByStep(data, 1);
      const midNodes = getCategoryByStep(data, 2);
      const lowNodes = getCategoryByStep(data, 3);

      // 2, 3depth
      for (let mid of midNodes) {
        mid.children = lowNodes.filter((low) => {
          if (mid.cateCode == low.sub1Code && mid.parentCode == low.parentCode) {
            expand.push(mid.cateCode);
            return low;
          }
        });
      }
      // 1depth
      for (let top of topNodes)
        top.children = midNodes.filter((mid) => {
          if (top.cateCode == mid.parentCode) {
            expand.push(top.cateCode);
            return mid;
          }
        });

      data = topNodes;
    }

    return {
      data,
      expand: [...new Set(expand)],
      error: error ? getErrorMessage[error.code] || '데이터 조회에 실패하였습니다.' : '',
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}

function getCategoryByStep(data, step) {
  const header = step == 1 ? 'root' : step == 2 ? 'middle' : 'last';
  return data.reduce((acc, item) => {
    if (item.cateStep === step) {
      const obj = {
        key: item.cateCode,
        header,
        ...item,
      };
      if (step != 3) obj.children = [];
      acc.push(obj);
    }
    return acc;
  }, []);
}

/**
 * 시험분류 사용여부 변경
 * @param {array} arr
 * @returns object
 */
export async function $updateExamCategoryUsyn(arr) {
  try {
    store.setLoading(true);

    const { error } = await supabase
      .from('tb_exam_cate_info')
      .update({
        use_flag: 'N',
        updt_dt: $getNowString(),
      })
      .or(
        `cate_code.in.(${arr.join(',')}),parent_code.in.(${arr.join(',')}),sub1_code.in.(${arr.join(',')})`,
      );

    return {
      error: error ? getErrorMessage[error.code] || '삭제 실패하였습니다.' : null,
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}

/**
 * 1, 2, 3 depth 목록 조회
 * @param {number} parentCode
 * @param {number} subCode
 * @returns object
 */
export async function $fetchedExamCategoryByDepth(cateStep, parentCode, subCode) {
  try {
    let query = supabase
      .from('tb_exam_cate_info')
      .select('cate_code, cate_name, parent_code, sub1_code, cate_step')
      .eq('use_flag', 'Y')
      .eq('cate_step', cateStep)
      .order('cate_code', { ascending: true }); // 내림차순 정렬

    if (parentCode) query = query.eq('parent_code', parentCode);
    if (subCode) query = query.eq('sub1_code', subCode);

    const { data, error } = await query;

    return {
      data: snakeToCamelByObj(data).map((data) => {
        return {
          ...data,
          label: data.cateName,
          value: data.cateCode,
        };
      }),
      error: error ? getErrorMessage[error.code] || '데이터 조회에 실패하였습니다.' : '',
    };
  } catch (err) {
    console.log(err);
  }
}
