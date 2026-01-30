<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">문제등록</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="current">문제등록</span>
        </div>
      </q-card-section>

      <q-card-section class="q-py-none">
        <p class="text-subtitle2 q-mb-sm before-line">미리보기</p>

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
                  v-for="item of questionTypeList" :key="item.id"
                  v-model="form.questionType"
                  :val="item.value" :label="item.label"
                  size="xs" class="q-mr-sm"
                />
              </td>
            </tr>
            <tr>
              <th>문항ID</th>
              <td>
                {{ !form.questionCode ?  '자동 생성' : form.questionCode }}
              </td>
              <th>출제자</th>
              <td>
                <q-input
                  v-model="form.examiner"
                  outlined
                  dense
                  fill
                  class="full-width"
                />
              </td>
              <th>출제일</th>
              <td>{{ !form.questionCode ? '자동 생성' : form.rgstDt }}</td>
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
                  <q-radio v-model="form.difficultyLevel" :val="3" label="상" size="xs" />
                  <q-radio v-model="form.difficultyLevel" :val="2" label="중" size="xs" />
                  <q-radio v-model="form.difficultyLevel" :val="1" label="하" size="xs" />
                </div>
              </td>
              <th>추정정답률</th>
              <td>
                <div class="row">
                  <q-input
                    v-model="form.correctRate"
                    input-class="text-right"
                    :readonly="form.correctCk"
                    suffix="%"
                    mask="###"
                    outlined
                    dense
                    fill
                    class="col-xs-12 col-md-8"
                  />
                  <q-checkbox
                    @update:modelValue="form.correctRate = null"
                    v-model="form.correctCk"
                    :val="1"
                    label="해당없음"
                    size="xs"
                    class="col-xs-12 col-md-4"
                  />
                </div>
              </td>
              <th>지식수준</th>
              <td>
                <div class="q-gutter-x-sm">
                  <q-radio v-model="form.questionLevel" :val="1" label="암기" size="xs" />
                  <q-radio v-model="form.questionLevel" :val="2" label="해석(판단)" size="xs" />
                  <q-radio v-model="form.questionLevel" :val="3" label="해결" size="xs" />
                  <q-radio v-model="form.questionLevel" :val="4" label="해당없음" size="xs" />
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
                    size="xs"
                  />
                  <q-checkbox
                    v-model="form.qRelevanceCheck"
                    :val="2"
                    label="중요한(important) "
                    size="xs"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>문항주제</th>
              <td colspan="5">
                <q-input v-model="form.topic" outlined dense fill class="full-width" />
              </td>
            </tr>
            <tr>
              <th>키워드</th>
              <td colspan="5">
                <q-btn 
                  v-for="(keyword, i) of form.keyword" :key="i"
                  @click="form.keyword.splice(i, 1)"
                  :label="keyword"
                  icon-right="close" 
                  size="sm" color="secondary"
                  dense unelevated 
                  rounded no-caps outline :ripple="false"
                  class="q-px-sm q-ml-xs q-mb-xs"
                />
                <q-input
                  @keyup.enter="addKeyword"
                  v-model="keyword" 
                  outlined dense fill 
                  class="full-width" 
                />
              </td>
            </tr>
            <tr>
              <th>참고문헌</th>
              <td colspan="5">
                <q-input v-model="form.reference" outlined dense fill class="full-width" />
              </td>
            </tr>
          </tbody>
        </table>
      </q-card-section>

      <!-- 머리글 -->
      <q-card-section class="q-pb-none">
        <p 
          :class="{ star : form.questionType == 5 }"
          class="text-subtitle2 q-mb-sm before-line"
        >머리글</p>
        <tiptabEditor v-model="form.headerText" :height="100" />
      </q-card-section>

      <template v-if="form.questionType != 5">
        <!-- 문항줄기 -->
        <q-card-section class="q-pb-none">
          <p class="text-subtitle2 q-mb-sm before-line star">문항줄기</p>
          <tiptabEditor v-model="form.question" :height="100" />
        </q-card-section>
        
        <!-- 자료제시 -->
        <q-card-section class="q-pb-none">
          <p class="text-subtitle2 q-mb-sm before-line">자료제시</p>
          <!-- button -->
          <MidiaTypeAddButton 
            @add="form.presentation.push($event)" 
            :midiaItems="form.presentation"
            :midiaType
            :type="['image', 'audio', 'video', 'text']"
          />
          <!-- preview -->
          <MidiaItem 
            v-for="(item, i) of form.presentation" :key="i"
            v-model="form.presentation[i]"
            :midiaType="midiaType.find(m => m.type == item.midiaType)"
            :isExample="false"
          />
        </q-card-section>

        <q-card-section>
          <p class="text-subtitle2 q-mb-sm before-line">답가지</p>
        </q-card-section>
      </template>
    </q-card>

    <ImageGen v-model="isGen" />
    <q-btn @click="isGen = true" label="333"></q-btn>
  </q-page>
</template>

<script setup>
import ImageGen from 'src/components/common/ImageGen.vue';


const form = ref({
  questionType: 1,
  questionCode: null,
  examiner: '',
  rgstDt: null,
  cate1Code: null,     // 시험분류
  cate2Code: null,
  cate3Code: null,
  controlNo: 1,        // 문제번호
  point: 1,            // 점수
  subjectCate1: null,  // 교과목분류
  subjectCate2: null,
  subjectCate3: null,
  difficultyLevel: 2,  // 예상 난이도
  correctRate: null,   // 추천정답률
  correctCk: true,
  questionLevel: 4,    // 지식수준
  qRelevanceCheck: [], // 문항적절성
  topic: '',           // 문항주제
  keyword: [],         // 키워드
  reference: '',       // 참고문헌
  headerText: '',      // 머리글
  question: '',        // 문항줄기
  presentation: []     // 자료제시
});

const keyword = ref('');

const isGen = ref(false);

// 키워드 등록
const addKeyword = () => {
  if (!keyword.value) return;
  if (!form.value.keyword.includes(keyword.value))
    form.value.keyword.push(keyword.value);
  keyword.value = '';
};

</script>



<script>
const questionTypeList = [
  { value: 1, label: '객관식(A형)' },
  { value: 5, label: '객관식(R형)' },
  { value: 3, label: '주관식' },
  { value: 4, label: '말하기' },
];
const midiaType = [
  { type: 'image', icon: 'bi-images', exts: ['.jpg', '.jpeg', '.png', '.gif'], maxSize: 10 * 1024 * 1024 },
  { type: 'audio', icon: 'bi-volume-up', exts: ['.mp3', '.wav'], maxSize: 10 * 1024 * 1024 },
  { type: 'video', icon: 'bi-camera-video', exts: ['.mp4', '.webm'], maxSize: 20 * 1024 * 1024  },
  { type: 'text', icon: 'bi-card-text' },
];

</script>

<style scoped></style>
