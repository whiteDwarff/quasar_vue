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
    const { data, error } = await supabase
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
        re_item_exam_no,
        re_item_example,
        use_flag
        )
        `,
      )
      .eq('research_code', researchCode)
      .eq('tb_research_item_info.use_flag', 'Y')
      .order('re_item_no', { referencedTable: 'tb_research_item_info', ascending: true })
      .single();

    return {
      data: snakeToCamelByObj(data),
      error: error ? getErrorMessage[error.code] || '조회 실패하였습니다.' : '',
    };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}
