const store = useSystemStore();

export async function $saveSurveyInfo(form) {
  try {
    store.setLoading(false);
    const { researchTitle, researchMemo } = form;
    let surveyQuery = await supabase.from('tb_research_info');

    // 등록
    if (!form?.researchCode) {
      surveyQuery = surveyQuery
        .insert({
          research_title: researchTitle,
          research_memo: researchMemo,
        })
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

    // 설문정보 저장 후
    if (!error && data?.research_code) {
      const insertArr = [];
      const updateArr = [];

      let sort = 0;
      for (let item of form.survey) {
        // 사용중인 경우에만 문항번호 재할당
        if (item.useFlag == 'Y') sort++;
        const obj = {
          research_code: data.research_code,
          re_item_no: sort,
          re_item_title: item.title,
          re_item_type: item.type,
          re_item_exam_no: sort,
          re_item_example: item.example.map((example) => example.value).join(','),
          use_flag: item.useFlag,
        };

        if (item?.reItemCode) {
          obj.re_item_code = item.reItemCode;
          updateArr.push(obj);
        } else insertArr.push(obj);
      }

      if (insertArr.length) await supabase.from('tb_research_item_info').insert(insertArr);
      if (updateArr.length) await supabase.from('tb_research_item_info').upsert(updateArr);
    }
    return { data, error };
  } catch (err) {
    console.log(err);
  } finally {
    store.setLoading(false);
  }
}
