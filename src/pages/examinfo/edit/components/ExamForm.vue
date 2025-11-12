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
        <p class="text-subtitle2 text-weight-bold q-mb-md before-line">시험명 등록</p>
        <table class="markup-table">
          <colgroup>
            <col width="20%" />
            <col width="80%" />
          </colgroup>
          <tbody>
            <tr>
              <th class="star">시험명</th>
              <td><q-input v-model="form.examName" outlined dense /></td>
            </tr>
          </tbody>
        </table>
      </q-card-section>

      <!-- 상세 목록 -->
      <q-card-section>
        <p class="text-subtitle2 text-weight-bold q-mb-md before-line">상세정보 등록</p>
        <q-scroll-area
          ref="scrollTargetRef"
          :style="{ height: `${form.details.length > 1 ? 350 : 280}px` }"
        >
          <div
            v-for="(item, i) of form.details.filter((item) => item.useFlag == 'Y')"
            :key="i"
            class="dashed-line"
          >
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
                        <q-input v-model="item.formName" outlined dense fill class="full-width" />
                      </div>
                      <div class="col-1">
                        <q-btn
                          @click="exceptExamItem(item, i)"
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
                      v-model="item.method"
                      :options="['UBT', 'IBT']"
                      outlined
                      dense
                      options-dense
                    />
                  </td>
                  <th class="star">시험시간</th>
                  <td>
                    <q-input
                      v-model="item.totalTime"
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
                      v-model="item.personalInfoUseFlag"
                      name="personalInfoUseFlag"
                      val="Y"
                      label="사용"
                      size="sm"
                    />
                    <q-radio
                      v-model="item.personalInfoUseFlag"
                      name="personalInfoUseFlag"
                      val="N"
                      label="미사용"
                      size="sm"
                    />
                    <div v-if="item.personalInfoUseFlag == 'Y'" class="q-pl-xs">
                      <!-- 
                      <small class="block q-mb-sm text-red">
                      • App 로그인 후 확인할 수 있습니다.</small
                      > -->
                      <q-input
                        v-model="item.personalInfoMessage"
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
        <div class="flex">
          <CustomButton
            v-if="$route?.params?.examCode"
            @click="updateExamInfoUsyn"
            label="삭제"
            color="warning"
            outline
            class="w-100 q-mr-sm"
          />
          <CustomButton @click="submit()" label="저장" class="w-100" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const router = useRouter();
// const route = useRoute();

const form = defineModel();

const scrollTargetRef = ref(null);

// 세부정보 삭제
const exceptExamItem = (target, targetIndex) => {
  if (form.value.details.length == 1) return $showAlert('하나의 상세정보는 등록되어야합니다.');
  // 등록된 정보인 경우 useFlag 변경
  if (target?.examCode) {
    target.useFlag = 'N';
    return;
  }
  // 신규 등록이라면 제외
  form.value.details = form.value.details.filter((item, i) => i != targetIndex);
};
// 세부정보 추가
const addExamItem = () => {
  form.value.details.push({
    examFormCode: null,
    formName: '',
    method: 'UBT',
    totalTime: '',
    personalInfoUseFlag: 'N',
    personalInfoMessage: '',
    useFlag: 'Y',
  });
  // 스크롤을 하단으로 이동
  nextTick(() => {
    const el = scrollTargetRef.value;
    el.setScrollPosition('vertical', el.getScrollTarget().scrollHeight, 300);
  });
};
// 저장
const submit = async () => {
  if (!form.value.examName) return $showAlert('시험명을 입력해주세요.');

  for (let item of form.value.details) {
    if (!item.formName) return $showAlert('시험 세부 설명을 입력해주세요.');
    if (!item.totalTime) return $showAlert('시험시간을 입력해주세요.');
    if (item.personalInfoUseFlag == 'Y' && !item.personalInfoMessage)
      return $showAlert('안내문동의 메시지를 입력해주세요.');
  }

  if (await $showConfirm('저장하시겠습니까?')) {
    const status = await editExamInfo(form.value);

    if (status) {
      await router.push('/examInfo');
      return $showAlert('저장되었습니다.');
    }
    $showAlert('저장 실패하였습니다.');
  }
};
// 취소 후 목록으로 이동
const cancle = async () => {
  const status = await $showConfirm('취소하시겠습니까?');
  if (status) router.push('/examInfo');
};
// 삭제
const updateExamInfoUsyn = async () => {
  if (!(await $showConfirm('삭제하시겠습니까?'))) return;

  const result = await updateExamInfoUseFlag(form.value.examCode);

  if (result) {
    await router.push('/examInfo');
    $showAlert('삭제되었습니다.');
  } else $showAlert('삭제 실패하였습니다.');
};
</script>
