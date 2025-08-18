<template>
  <q-page padding>
    {{ form }}
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">문제등록</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">문제등록</span>
          <span class="current">문제등록</span>
        </div>
      </q-card-section>
      <q-card-section>
        <p class="text-subtitle2 text-weight-bold q-mb-md before-line">미리보기</p>

        <table class="markup-table">
          <colgroup>
            <col width="10%" />
            <col width="23.33%" />
            <col width="10%" />
            <col width="23.33%" />
            <col width="10%" />
            <col width="23.33%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="star">문제유형</th>
              <td colspan="5">
                <q-radio
                  v-for="item of questionTypeList"
                  :key="item.id"
                  v-model="form.questionType"
                  :val="item.value"
                  :label="item.label"
                  size="sm"
                  class="q-mr-sm"
                />
              </td>
            </tr>
            <tr>
              <th>문항ID</th>
              <td>
                {{ !form.questionCode ? '미기입(자동 생성)' : form.questionCode }}
              </td>
              <th class="star">출제자</th>
              <td>
                <q-input
                  v-model="form.examiner"
                  outlined
                  dense
                  fill
                  class="full-width"
                  placeholder="출제자를 입력하세요."
                />
              </td>
              <th>출제일</th>
              <td>{{ !form.questionCode ? '미기입(자동 생성)' : form.rgstDt }}</td>
            </tr>
            <tr>
              <th class="star">문제번호</th>
              <td>
                <q-input
                  v-model="form.controlNo"
                  outlined
                  dense
                  fill
                  mask="#####"
                  class="full-width"
                  placeholder="문제번호를 입력하세요."
                />
              </td>
              <th class="star">배점</th>
              <td colspan="3">
                <q-input
                  v-model="form.point"
                  outlined
                  dense
                  fill
                  mask="###"
                  style="width: 40%"
                  placeholder="배점을 입력하세요."
                />
              </td>
            </tr>
            <tr>
              <th class="star">시험분류</th>
              <td colspan="5">
                <ExamCategorySelect v-model="form" />
              </td>
            </tr>

            <tr>
              <th>교과목 분류</th>
              <td colspan="5">
                <SubjectCategorySelect v-model="form" />
              </td>
            </tr>
            <tr>
              <th>예상 난이도</th>
              <td>
                <div class="q-gutter-x-sm">
                  <q-radio v-model="form.difficultyLevel" :val="3" label="상" size="sm" />
                  <q-radio v-model="form.difficultyLevel" :val="2" label="중" size="sm" />
                  <q-radio v-model="form.difficultyLevel" :val="1" label="하" size="sm" />
                </div>
              </td>
              <th>추정정답률</th>
              <td>
                <q-input
                  v-model="form.correctRate"
                  input-class="text-right"
                  suffix="%"
                  mask="###"
                  outlined
                  dense
                  fill
                  class="full-width"
                />
              </td>
              <th>지식수준</th>
              <td>
                <div class="q-gutter-x-sm">
                  <q-radio v-model="form.questionLevel" :val="1" label="암기" size="sm" />
                  <q-radio v-model="form.questionLevel" :val="2" label="해석(판단)" size="sm" />
                  <q-radio v-model="form.questionLevel" :val="3" label="해결" size="sm" />
                  <q-radio v-model="form.questionLevel" :val="4" label="해당없음" size="sm" />
                </div>
              </td>
            </tr>
            <tr>
              <th>문항적절성</th>
              <td colspan="5">
                <div class="q-gutter-sm">
                  <q-checkbox
                    v-model="form.qRelevanceCheck"
                    :val="1"
                    label="필수적인(essential)"
                    size="sm"
                  />
                  <q-checkbox
                    v-model="form.qRelevanceCheck"
                    :val="2"
                    label="중요한(important) "
                    size="sm"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>키워드</th>
              <td colspan="5">
                <q-input v-model="keyword" outlined dense fill class="full-width" />
              </td>
            </tr>
          </tbody>
        </table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
const questionTypeList = [
  { value: 1, label: '객관식(A형)' },
  { value: 5, label: '객관식(R형)' },
  { value: 3, label: '주관식' },
  { value: 4, label: '말하기' },
];
</script>

<script setup>
const form = ref({
  questionType: 1,
  questionCode: null,
  examiner: '',
  rgstDt: null,
  cate1Code: null, // 시험분류
  cate2Code: null,
  cate3Code: null,
  controlNo: 1, // 문제번호
  point: 1, // 점수
  subjectCate1: null, // 교과목분류
  subjectCate2: null,
  subjectCate3: null,
  difficultyLevel: 2, // 예상 난이도
  correctRate: null, // 추천정답률
  questionLevel: 4, // 지식수준
  qRelevanceCheck: [], // 문항적절성
  keyword: [],
});

const keyword = ref('');
</script>

<style scoped></style>
