<template>
  <q-page padding>
    {{ param }}

    <q-card flat>
      <q-card-section class="search-wrap">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span>회사명</span>
              <div class="content">
                <SelectFilter v-model="param.companySeq" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span>회사명</span>
              <div class="content">
                <q-input v-model="param.companyName" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span>등록자</span>
              <div class="content">
                <q-input v-model="param.regId" outlined dense class="bg-white" />
              </div>
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-3">
            <div class="flex items-center">
              <span>등록일</span>
              <div class="content">
                <DatePicker v-model="param.regDay" :range="true" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const param = ref({
  companySeq: '',
  companyName: '',
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
