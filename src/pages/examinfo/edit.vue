<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">시험정보등록</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">시험정보</span>
          <span class="current">시험정보등록</span>
        </div>
      </q-card-section>

      <!-- 상세정보 -->
      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-md">
          <div class="col-xs-12 col-md-6">
            <span class="form-label star">회사명</span>
            <div>
              <SelectFilter
                v-model="form.companySeq"
                :options="[
                  { label: '엔비디아', value: 10 },
                  { label: '테슬라', value: 11 },
                  { label: '애플', value: 12 },
                ]"
              />
            </div>
          </div>
          <div class="col-xs-12 col-md-6">
            <span class="form-label star">시험명</span>
            <div>
              <q-input v-model="form.examName" outlined dense />
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- 상세 목록 -->
      <q-card-section>
        <q-scroll-area ref="scrollTargetRef" style="height: 350px">
          <div v-for="(item, i) of form.list" :key="i" class="dashed-line">
            <p class="text-subtitle2 text-weight-bold q-mb-md">세부정보 등록</p>
            <table class="markup-table">
              <colgroup>
                <col width="20%" />
                <col width="30%" />
                <col width="20%" />
                <col width="30%" />
              </colgroup>
              <tbody>
                <tr>
                  <th class="star">시험 세부 설명</th>
                  <td colspan="3">
                    <div class="row q-col-gutter-xs">
                      <div class="col-11">
                        <q-input
                          v-model="item.examFormName"
                          outlined
                          dense
                          fill
                          class="full-width"
                        />
                      </div>
                      <div class="col-1">
                        <q-btn
                          @click="exceptExamItem(i)"
                          icon="bi-trash3"
                          round
                          flat
                          :ripple="false"
                          color="grey-14"
                          size="sm"
                          class="fit"
                        />
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th class="star">시험방법</th>
                  <td>
                    <q-select
                      v-model="item.examMethod"
                      :options="['UBT', 'IBT']"
                      outlined
                      dense
                      options-dense
                    />
                  </td>
                  <th class="star">시험시간</th>
                  <td>
                    <q-input
                      v-model="item.examTime"
                      outlined
                      dense
                      fill
                      class="full-width"
                      mask="###"
                      suffix="분"
                    />
                  </td>
                </tr>
                <tr>
                  <th class="star">안내문 동의</th>
                  <td colspan="3">
                    <q-radio
                      v-model="item.messageFlag"
                      name="messageFlag"
                      val="Y"
                      label="사용"
                      size="sm"
                    />
                    <q-radio
                      v-model="item.messageFlag"
                      name="messageFlag"
                      val="N"
                      label="미사용"
                      size="sm"
                    />
                    <div v-if="item.messageFlag == 'Y'" class="q-pl-xs">
                      <!-- 
                      <small class="block q-mb-sm text-red">
                      • App 로그인 후 확인할 수 있습니다.</small
                      > -->
                      <q-input
                        v-model="item.message"
                        label="안내문동의 메시지를 입력해주세요."
                        outlined
                        dense
                        fill
                        type="textarea"
                        class="full-width"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </q-scroll-area>
        <!-- 추가 -->
        <div class="flex justify-center q-mt-md">
          <CustomButton @click="addExamItem()" label="상세정보 추가" icon="bi-plus" />
        </div>
      </q-card-section>
      <q-card-section class="flex justify-between">
        <CustomButton @click="cancle()" label="취소" outline class="w-100" />
        <CustomButton @click="submit()" label="저장" class="w-100" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const router = useRouter();

const form = ref({
  companySeq: '',
  examName: '',
  list: [
    {
      examFormName: '',
      examMethod: 'UBT',
      examTime: '',
      messageFlag: 'N',
      message: '',
    },
  ],
});

const scrollTargetRef = ref(null);

// 세부정보 삭제
const exceptExamItem = (targetIndex) => {
  if (form.value.list.length == 1) return $showAlert('하나의 상세정보는 등록되어야합니다.');

  form.value.list = form.value.list.filter((item, i) => i != targetIndex);
};
// 세부정보 추가
const addExamItem = () => {
  form.value.list.push({
    examFormName: '',
    examMethod: 'UBT',
    examTime: '',
    messageFlag: 'N',
    message: '',
  });
  // 스크롤을 하단으로 이동
  nextTick(() => {
    const el = scrollTargetRef.value;
    el.setScrollPosition('vertical', el.getScrollTarget().scrollHeight, 300);
  });
};
// 저장
const submit = async () => {
  if (!form.value.companySeq) return $showAlert('회사를 선택해주세요.');
  if (!form.value.examName) return $showAlert('시험명을 입력해주세요.');

  for (let item of form.value.list) {
    if (!item.examFormName) return $showAlert('시험 세부 설명을 입력해주세요.');
    if (!item.examTime) return $showAlert('시험시간을 입력해주세요.');
    if (item.messageFlag == 'Y' && !item.message)
      return $showAlert('안내문동의 메시지를 입력해주세요.');
  }

  const status = await $showConfirm('저장하시겠습니까?');

  if (status) {
    // axios
  }
};
// 취소 후 목록으로 이동
const cancle = async () => {
  const status = await $showConfirm('취소하시겠습니까?');
  if (status) router.push('/examInfo');
};
</script>

<route lang="yaml">
meta:
  layout: default
</route>
