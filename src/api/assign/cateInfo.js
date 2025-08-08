const store = useSystemStore();

// insert 로직 공통 함수
async function insertCategories(rows) {
  let query = supabase
    .from('tb_exam_cate_info')
    .insert(camelToSnakeByObj(rows))
    .select('cate_code');

  // 1depth인 경우 하나의 cateCode만 조회
  if (rows.length == 1) query = query.single();

  const { data, error } = await query;
  return { data, error };
}

// 카테고리 저장
export async function $saveCateInfo(form) {
  for (let top of form) {
    if (!top?.cateCode) {
      const { cateName, cateStep } = top;

      // 1depth 저장
      const { data: topRes, error: topErr } = await insertCategories([{ cateName, cateStep }]);

      if (topErr) {
        continue;
      }

      // 2depth 저장 준비
      const midRows = top.children.map((child) => ({
        parentCode: topRes.cate_code,
        cateName: child.cateName,
        cateStep: 2,
      }));

      const { data: midRes, error: midErr } = await insertCategories(midRows);

      if (midErr) {
        console.error('2depth 저장 실패:', midErr);
        continue;
      }

      // 3depth 저장 (병렬 처리)
      await Promise.all(
        top.children.map(async (mid, i) => {
          const lowRows = mid.children.map((child) => ({
            parentCode: topRes.cate_code,
            sub1Code: midRes[i].cate_code,
            cateName: child.cateName,
            cateStep: 3,
          }));

          if (lowRows.length === 0) return;

          const { data: lowRes, error: lowErr } = await insertCategories(lowRows);

          if (lowErr) {
            console.error('3depth 저장 실패:', lowErr);
          } else {
            console.log('3depth 저장 성공:', lowRes);
          }
        }),
      );
    }
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
      .order('cate_code', { ascending: false }); // 내림차순 정렬

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
