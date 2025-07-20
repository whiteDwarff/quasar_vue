<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">설문등록</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">배정관리</span>
          <span class="current">설문등록</span>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p class="text-subtitle2 text-weight-bold q-mb-md before-line">설문정보 등록</p>
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md-6">
            <span class="form-label star">설문제목</span>
            <div>
              <q-input v-model="form.title" outlined dense />
            </div>
          </div>
          <div class="col-xs-12 col-md-6">
            <span class="form-label">설문설명</span>
            <div>
              <q-input v-model="form.memo" outlined dense />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <p class="text-subtitle2 text-weight-bold q-mb-md before-line">설문문항 등록</p>
        <!-- 설문 문항 선택 -->
        <div id="survey-order-wrap" class="q-mb-sm">
          <q-btn
            v-for="item of form.survey"
            :key="item.order"
            @click="form.currentOrder = item.order"
            :label="item.order"
            :outline="form.currentOrder != item.order"
            paddng="xs"
            color="primary"
            unelevated
            class="q-ml-xs q-mb-xs"
            style="width: 36px; height: 36px"
          >
            <q-tooltip class="text-center">
              <span>{{ item.title ? item.title : '문제를 입력해주세요.' }}</span>
              <p v-if="item.title">
                <span>{{ item.type == 1 ? '객관식' : '주관식' }}</span>
                <span>{{ item.type == 1 ? ` / ${item.example.length}` : '' }}</span>
              </p>
            </q-tooltip>
          </q-btn>
        </div>

        <template v-for="item of form.survey" :key="item.order">
          <table v-if="item.order == form.currentOrder" class="markup-table">
            <colgroup>
              <col width="20%" />
              <col width="80%" />
            </colgroup>
            <tbody>
              <tr>
                <th class="star">문제</th>
                <td>
                  <div class="flex">
                    <q-input
                      v-model="item.title"
                      :autofocus
                      outlined
                      dense
                      fill
                      style="width: calc(100% - 48px)"
                    />
                    <q-btn
                      @click="exceptSurveyItem(item.order)"
                      icon="bi-trash3"
                      flat
                      :ripple="false"
                      round
                      color="grey-14"
                      size="sm"
                      class="q-ml-sm"
                      style="width: 40px; height: 40px"
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <th class="star">설문유형</th>
                <td>
                  <q-radio
                    v-model="item.type"
                    name="surveyType"
                    :val="1"
                    label="객관식"
                    size="sm"
                  />
                  <q-radio
                    v-model="item.type"
                    name="surveyType"
                    :val="3"
                    label="주관식"
                    size="sm"
                  />
                </td>
              </tr>
              <template v-if="item.type == 1">
                <tr v-for="(example, i) of item.example" :key="i">
                  <th>보기 {{ example.order }}</th>
                  <td>
                    <div class="flex items-center example-row">
                      <q-input
                        v-model="example.value"
                        outlined
                        dense
                        fill
                        :class="{ last: i + 1 == item.example.length }"
                      />
                      <q-btn
                        @click="exceptExample(example.order, item.example)"
                        icon="bi-dash"
                        rounded
                        dense
                        outline
                        unelevated
                        color="grey-7"
                        class="rounded-50"
                      />
                      <q-btn
                        v-if="i + 1 == item.example.length"
                        @click="addExample(item.example)"
                        icon="bi-plus"
                        rounded
                        dense
                        outline
                        unelevated
                        color="grey-7"
                        class="rounded-50 plus"
                      />
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </template>

        <q-card-section class="flex justify-between q-px-none">
          <CustomButton @click="cancle" label="취소" outline class="w-100" />
          <div class="flex">
            <CustomButton
              @click="deleteSurvey"
              label="삭제"
              color="warning"
              outline
              class="w-100"
            />
            <CustomButton @click="addSurvey" label="설문추가" outline class="q-mx-md w-100" />
            <CustomButton @click="saveSurveyInfo" label="저장" class="w-100" />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const router = useRouter();

const form = defineModel();

const autofocus = ref(false);

// 설문삭제
const deleteSurvey = async () => {
  if ((await $showConfirm('설문을 삭제하시겠습니까?')) == false) return;

  router.push('/assign/survey');
  /*
  try {
    const res = $axios_loading.post('', form.value);

    if(res.data.status == 200) {
      $showAlert('삭제되었습니다.');
      return router.push('/assign/survey');
    }  
    $showAlert('삭제 실패하였습니다.');
  } catch(err) {
    console.log(err);
  }
    */
};
// 설문정보 저장
const saveSurveyInfo = async () => {
  if (!form.value.title) return $showAlert('설문제목을 입력해주세요.');

  for (let survey of form.value.survey) {
    if (!survey.title) return $showAlert(`${survey.order}번 문항의 문제를 입력해주세요.`);

    if (survey.type == 1 && survey.example.some(({ value }) => !value))
      return $showAlert(`${survey.order}번 문항의 보기를 모두 입력해주세요.`);
  }
  /*
  try {
    const res = $axios_loading.post('', form.value);

    if(res.data.status == 200) {
      $showAlert('저장되었습니다.');
      return router.push('/assign/survey');
    }  
    $showAlert('저장 실패하였습니다.');
  } catch(err) {
    console.log(err);
  }
  */
};
// 설문삭제
const exceptSurveyItem = (order) => {
  if (form.value.survey.length == 1) return $showAlert('하나의 문항은 등록되어야합니다.');

  let newOrder = 1;
  form.value.survey = form.value.survey.filter((item) => {
    if (item.order != order) {
      item.order = newOrder;
      newOrder++;
      return item;
    }
  });
  form.value.currentOrder = order != 1 ? order - 1 : 1;
};
// 설문추가
const addSurvey = async () => {
  const current = form.value.survey.length + 1;
  form.value.survey.push({
    title: '',
    type: 1,
    order: current,
    example: [
      { value: '', order: 1 },
      { value: '', order: 2 },
    ],
  });
  form.value.currentOrder = current;
  autofocus.value = true;
};
// 설문 보기항목 삭제
const exceptExample = (order, example) => {
  if (example.length <= 2) return $showAlert('두개의 보기는 등록되어야합니다.');
  for (let survey of form.value.survey) {
    if (survey.order == form.value.currentOrder) {
      let newOrder = 1;
      survey.example = survey.example.filter((item) => {
        if (item.order != order) {
          item.order = newOrder;
          newOrder++;
          return item;
        }
      });
      break;
    }
  }
};
// 설문 보기항목 추가
const addExample = (example) => {
  if (example.length > 9) return $showAlert('보기는 10개를 초과할 수 없습니다.');
  example.push({ value: '', order: example.length + 1 });
};
// 취소 후 목록으로 이동
const cancle = async () => {
  if (await $showConfirm('취소하시겠습니까?')) router.push('/assign/survey');
};
</script>

<style scoped>
.table-height {
  height: 337px;
}
.example-row .q-input {
  width: calc(100% - 41px);
}
.example-row .q-input.last {
  width: calc(100% - 82px);
}
.example-row .q-btn {
  width: 33px;
  height: 33px;
  margin-left: 8px;
}
</style>
