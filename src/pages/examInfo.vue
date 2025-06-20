<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="search-wrap">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span class="label">회사명</span>
              <div class="content">
                <SelectFilter v-model="param.companySeq" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span class="label">시험명</span>
              <div class="content">
                <q-input v-model="param.examName" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span class="label">등록자</span>
              <div class="content">
                <q-input v-model="param.regId" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span class="label">등록일</span>
              <div class="content">
                <DatePicker v-model="param.regDay" :range="true" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex q-mt-lg">
          <q-space />
          <q-btn
            unelevated
            color="primary"
            label="초기화"
            dense
            outline
            :ripple="false"
            no-caps
            class="btn q-mr-md"
          />
          <q-btn unelevated color="primary" label="검색" dense :ripple="false" class="btn" />
        </div>
      </q-card-section>
    </q-card>

    <div class="flex edit-btn-wrap">
      <q-space />
      <q-btn unelevated color="primary" label="시험정보등록" dense :ripple="false" class="btn" />
    </div>

    <q-card flat>
      <q-table :rows="[1, 2, 3]" flat bordered>
        <template #header>
          <q-tr>
            <q-th>번호</q-th>
            <q-th>회사명</q-th>
            <q-th>시험명</q-th>
            <q-th>등록자</q-th>
            <q-th>등록일(년/월/일)</q-th>
            <q-th>관리</q-th>
          </q-tr>
        </template>
        <template #body>
          <q-tr>
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
            <q-td></q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
const param = ref({
  companySeq: '',
  examName: '',
  regId: '',
  regDay: [],
  regStDt: null,
  regEnDt: null,
})
</script>

<route lang="yaml">
meta:
  layout: default
</route>
