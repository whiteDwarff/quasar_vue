const store = useSystemStore();

/**
 * 설문 저장
 * @param {object} form
 * @returns object
 */
export async function $saveSurveyInfo(form) {
  try {
    store.setLoading(false);
    const { researchTitle, researchMemo } = form;
    let surveyQuery = supabase.from('tb_research_info');

    // 등록
    if (!form?.researchCode) {
      surveyQuery = surveyQuery
        .insert(camelToSnakeByObj({ researchTitle, researchMemo }))
        .select('research_code')
        .single();
      // 수정
    } else {
      surveyQuery = surveyQuery
        .update(
          camelToSnakeByObj({
            researchCode: form.researchCode,
            researchTitle,
            researchMemo,
            updtDt: $getNowString(),
          }),
        )
        .eq('research_code', form.researchCode)
        .select('research_code')
        .maybeSingle();
    }

    const { data, error } = await surveyQuery;

    // 성공 시 설문 문항 저장
    if (!error && data?.research_code) {
      const insertArr = [];
      const updateArr = [];

      let sort = 0;
      for (let item of [...form.survey]) {
        // 사용중인 경우에만 문항번호 재할당
        if (item.useFlag == 'Y') sort++;
        item.reItemNo = sort;
        item.reItemExamNo = sort;
        item.reItemExample = item.reItemExample.map((example) => example.value).join(',');
        const obj = camelToSnakeByObj(item);

        // 수정
        if (item?.reItemCode) {
          obj.updt_dt = $getNowString();
          updateArr.push(obj);
          // 등록
        } else {
          obj.research_code = data.research_code;
          insertArr.push(obj);
        }
      }

      if (insertArr.length) await supabase.from('tb_research_item_info').insert(insertArr);
      if (updateArr.length) await supabase.from('tb_research_item_info').upsert(updateArr);
    }
    return {
      data,
      error: error ? getErrorMessage[error.code] || '저장 실패하였습니다.' : '',
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}
/**
 * 설문 상세조회
 * @param {string} researchCode
 * @returns object
 */
export async function $fetchedSurveyInfo(researchCode) {
  try {
    store.setLoading(true);
    let { data, error } = await supabase
      .from('tb_research_info')
      .select(
        `
      research_code,
      research_title,
      research_memo,
      tb_research_item_info ( 
        re_item_code,
        research_code,
        re_item_no,
        re_item_title,
        re_item_type,
        re_item_example,
        use_flag
        )
        `,
      )
      .eq('research_code', researchCode)
      .eq('tb_research_item_info.use_flag', 'Y')
      .order('re_item_no', { referencedTable: 'tb_research_item_info', ascending: true })
      .single();

    if (!error) {
      data = snakeToCamelByObj(data);
      data.survey = [...data.tbResearchItemInfo];
      delete data.tbResearchItemInfo;
      data.currentOrder = 1;

      // 보기 데이터 재할당
      for (let item of data.survey) {
        item.reItemExample = item.reItemExample.split(',').map((example, i) => {
          return {
            value: example,
            order: i + 1,
          };
        });
      }
    }

    return {
      data,
      error: error ? getErrorMessage[error.code] || '조회 실패하였습니다.' : '',
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}
/**
 * 설문 목록조회
 * @param {object} param
 * @returns object
 */
export async function $fetchedSurveyList(param) {
  try {
    store.setLoading(true);

    const countQuery = supabase
      .from('tb_research_info')
      .select('*', { count: 'exact', head: true });

    const { count } = await fetchedListWhere(countQuery, param);
    // 받아올 데이터의 개수 계산
    const { offset, limit } = $getPagingOffset(param.current);

    const dataQuery = supabase
      .from('tb_research_info')
      .select(
        `
      research_code,
      research_title,
      research_memo,
      tb_research_item_info ( 
        re_item_code,
        research_code,
        re_item_no,
        re_item_title,
        re_item_type,
        re_item_example,
        use_flag
        )
        `,
      )
      .eq('tb_research_item_info.use_flag', 'Y');

    let { data, error } = await fetchedListWhere(dataQuery, param).range(offset, limit);
    data = snakeToCamelByObj(data);

    return {
      data,
      error: error ? getErrorMessage[error.code] || '데이터 조회에 실패하였습니다.' : '',
      max: $getPagingCount(count),
      count,
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}

function fetchedListWhere(query, param) {
  // 사용여부
  query = query.eq('use_flag', 'Y');
  // 설문 제목
  if (param.researchTitle) query = query.ilike('research_title', `%${param.researchTitle.trim()}%`);
  // 설문 설명
  if (param.researchMemo) query = query.ilike('research_memo', `%${param.researchMemo.trim()}%`);
  query.order('research_code', { ascending: false }); // 내림차순 정렬

  return query;
}
/**
 * 응시자정보 사용여부 변경
 * @param {array | string} value
 * @returns object
 */
export async function $updateSurveyUsyn(value) {
  store.setLoading(true);

  let query = supabase.from('tb_research_info').update({
    use_flag: 'N',
    updt_dt: $getNowString(),
  });

  if (Array.isArray(value)) {
    value = value.map((item) => item.researchCode);
    query = query.in('research_code', value);
  } else query = query.eq('research_code', value);

  const { error } = await query;

  store.setLoading(false);

  return {
    error: error ? getErrorMessage[error.code] : null,
  };
}
