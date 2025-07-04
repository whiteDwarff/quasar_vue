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
              <q-input outlined dense />
            </div>
          </div>
          <div class="col-xs-12 col-md-6">
            <span class="form-label">설문설명</span>
            <div>
              <q-input outlined dense />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <p class="text-subtitle2 text-weight-bold q-mb-md before-line">설문문항 등록</p>
        <table class="markup-table">
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="star">문제</th>
              <td>
                <div>
                  <q-input v-model="form.surveyQuizTitle" outlined dense fill class="full-width" />
                </div>
              </td>
            </tr>
            <tr>
              <th class="star">설문유형</th>
              <td>
                <q-radio
                  v-model="form.serveyType"
                  name="surveyType"
                  :val="1"
                  label="객관식"
                  size="sm"
                />
                <q-radio
                  v-model="form.serveyType"
                  name="surveyType"
                  :val="3"
                  label="주관식"
                  size="sm"
                />
              </td>
            </tr>
            <template v-if="form.serveyType == 1">
              <tr v-for="(item, i) of form.example" :key="i">
                <th>보기 {{ item.order }}</th>
                <td>
                  <div class="flex items-center example-row">
                    <q-input
                      v-model="item.value"
                      outlined
                      dense
                      fill
                      :class="{ last: i + 1 == form.example.length }"
                    />
                    <q-btn
                      icon="bi-dash"
                      rounded
                      dense
                      outline
                      unelevated
                      color="grey-7"
                      class="rounded-50"
                    />
                    <q-btn
                      v-if="i + 1 == form.example.length"
                      @click="addExample"
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
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const form = reactive({
  surveyQuizTitle: '',
  serveyType: 1,
  example: [
    {
      value: '',
      order: 1,
    },
  ],
});

const addExample = () => {
  if (form.example.length > 9) return $showAlert('보기는 10개를 초과할 수 없습니다.');
  form.example.push({ value: '', order: form.example.length + 1 });
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
