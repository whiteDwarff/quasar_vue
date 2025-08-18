const store = useSystemStore();

/**
 * insert 공통처리 함수
 * @param {object | array} values
 * @returns object
 */
async function insertSujectCategory(values) {
  let query = supabase
    .from('tb_subject_cate_info')
    .insert(camelToSnakeByObj(values))
    .select('subject_cate_code');

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
async function insertSujectCategoryChilds(inserValue, obj) {
  const { data, error } = await insertSujectCategory({
    ...inserValue,
    cateStep: 2,
  });

  if (error) return { error };

  // 3depth의 경우 일괄 insert
  const lowRows = await Promise.all(
    obj.children.map(async (child) => ({
      parentCode: inserValue.parentCode,
      sub1Code: data.subject_cate_code,
      subjectCateName: child.subjectCateName,
      cateStep: 3,
    })),
  );
  if (!lowRows.length) return { error: null };

  const { error: lowErr } = await insertSujectCategory(lowRows);

  return {
    error: lowErr ? lowErr : null,
  };
}
/**
 * 1depth의 subjectCateCode가 존재할 경우 하위 카테고리를 순회하며 등록, 수정
 * @param {object} row
 * @returns object
 */
async function upsertSubjectCategory(row) {
  let insertArr = []; // 등록 배열
  let updateArr = []; // 수정 배열
  const updtDt = $getNowString(); // 수정시간

  // 1depth 추가
  updateArr.push({
    subjectCateCode: row.subjectCateCode,
    subjectCateName: row.subjectCateName,
    updtDt,
  });

  // 2depth
  for (let mid of row.children) {
    // subjectCateCode가 있는 경우 수정
    if (mid?.subjectCateCode) {
      updateArr.push({
        subjectCateCode: mid.subjectCateCode,
        subjectCateName: mid.subjectCateName,
        updtDt,
      });
      for (let low of mid.children) {
        // 3depth update
        if (low?.subjectCateCode) {
          updateArr.push({
            subjectCateCode: low.subjectCateCode,
            subjectCateName: low.subjectCateName,
            updtDt,
          });
          // 3depth insert
        } else {
          insertArr.push({
            parentCode: mid.parentCode,
            sub1Code: mid.subjectCateCode,
            subjectCateName: low.subjectCateName,
          });
        }
      }
      // 2depth ~ 3depth insert
    } else {
      const { error } = await insertSujectCategoryChilds(
        {
          subjectCateName: mid.subjectCateName,
          parentCode: mid.parentCode,
        },
        mid,
      );

      if (error) return { error };
    }
  }
  // 등록
  const { error: insertError } = await insertSujectCategory(insertArr);
  // 수정
  const { error: updateError } = await supabase
    .from('tb_subject_cate_info')
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
export async function $saveSubjectCateInfo(form) {
  try {
    store.setLoading(true);
    for (let top of form.selected) {
      if (!top?.subjectCateCode) {
        const { subjectCateName, cateStep } = top;
        // 1depth 저장
        const { data: topRes, error: topErr } = await insertSujectCategory({
          subjectCateName,
          cateStep,
        });
        if (topErr) return getErrorMessage[topErr.code] || '저장 실패하였습니다.';
        // 2, 3depth 저장
        for (let mid of top.children) {
          const { error } = await insertSujectCategoryChilds(
            {
              parentCode: topRes.subject_cate_code,
              subjectCateName: mid.subjectCateName,
              cateStep: 2,
            },
            mid,
          );
          if (error) return getErrorMessage[error.code] || '저장 실패하였습니다.';
        }

        // 수정
      } else {
        const { error } = await upsertSubjectCategory(top);
        if (error) return getErrorMessage[error.code] || '저장 실패하였습니다.';
      }
    }
    // 삭제목록 useFlag 변경
    if (form.except.length) $updateSubjectCategoryUsyn(form.except);
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
export async function $fetchedSubjectCateInfo() {
  try {
    store.setLoading(true);

    let { data, error } = await supabase
      .from('tb_subject_cate_info')
      .select('subject_cate_code, subject_cate_name, parent_code, sub1_code, cate_step, use_flag')
      .eq('use_flag', 'Y')
      .order('subject_cate_code', { ascending: true }); // 내림차순 정렬

    const expand = [];

    if (!error) {
      data = snakeToCamelByObj(data);
      const topNodes = getCategoryByStep(data, 1);
      const midNodes = getCategoryByStep(data, 2);
      const lowNodes = getCategoryByStep(data, 3);

      // 2, 3depth
      for (let mid of midNodes) {
        mid.children = lowNodes.filter((low) => {
          if (mid.subjectCateCode == low.sub1Code && mid.parentCode == low.parentCode) {
            expand.push(mid.subjectCateCode);
            return low;
          }
        });
      }
      // 1depth
      for (let top of topNodes)
        top.children = midNodes.filter((mid) => {
          if (top.subjectCateCode == mid.parentCode) {
            expand.push(top.subjectCateCode);
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
        key: item.subjectCateCode,
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
export async function $updateSubjectCategoryUsyn(arr) {
  try {
    store.setLoading(true);

    const { error } = await supabase
      .from('tb_subject_cate_info')
      .update({
        use_flag: 'N',
        updt_dt: $getNowString(),
      })
      .or(
        `subject_cate_code.in.(${arr.join(',')}),parent_code.in.(${arr.join(',')}),sub1_code.in.(${arr.join(',')})`,
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
export async function $fetchedSubjectCategoryByDepth(cateStep, parentCode, subCode) {
  try {
    let query = supabase
      .from('tb_subject_cate_info')
      .select('subject_cate_code, subject_cate_name, parent_code, sub1_code, cate_step')
      .eq('use_flag', 'Y')
      .eq('cate_step', cateStep)
      .order('subject_cate_code', { ascending: true }); // 내림차순 정렬

    if (parentCode) query = query.eq('parent_code', parentCode);
    if (subCode) query = query.eq('sub1_code', subCode);

    const { data, error } = await query;

    return {
      data: snakeToCamelByObj(data).map((data) => {
        return {
          ...data,
          label: data.subjectCateName,
          value: data.subjectCateCode,
        };
      }),
      error: error ? getErrorMessage[error.code] || '데이터 조회에 실패하였습니다.' : '',
    };
  } catch (err) {
    console.log(err);
  }
}
