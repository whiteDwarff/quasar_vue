<template>
  <q-page padding>

    <q-card flat>
      <q-card-section class="q-py-none">
        <div class="flex items-baseline location-wrap" style="margin-bottom: 0">
          <span class="title">일정등록</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="current">일정등록</span>
        </div>
      </q-card-section>
      <q-card-section>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="left"
          narrow-indicator
        >
          <q-tab name="schedule" label="일정등록" class="q-pl-none" />
          <q-tab name="subject" label="과목등록" />
          <q-tab name="detail" label="상세정보등록" />
        </q-tabs>
      </q-card-section>

        <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-xs-8 col-md-9">
            <span class="form-label star">일정명</span>
            <div>
              <q-input v-model="form.seasonName" outlined dense />
            </div>
          </div>
          <div class="col-xs-4 col-md-3">
            <span class="form-label star">일정</span>
            <div>
              <q-input 
                v-model="form.scheClass" 
                outlined 
                dense mask="##" 
                prefix="일일 최대" suffix="교시" 
                input-class="text-right"
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>

const tab = ref('schedule');

const form = ref({
  seasonName: '',
  scheClass: 1,
  schedules: [
    {
      examName: '',
      examCode: null,
    }
  ]
})
</script>

<style lang="scss" scoped></style>
