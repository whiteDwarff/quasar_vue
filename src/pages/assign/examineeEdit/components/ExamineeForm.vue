<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">응시자등록</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">배정관리</span>
          <span class="current">응시자등록</span>
        </div>
      </q-card-section>

      <q-card-section class="form-wrap">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-md">
          <div class="col-xs-12 col-md-2">
            <div @click="thumbClick()" class="text-center cursor-pointer">
              <input
                @change="render($event.target)"
                ref="imageInput"
                type="file"
                class="none"
                accept=".jpg, .jpeg, .png"
              />
              <q-icon
                class="profile-wrap rounded-borders"
                v-if="!form.examineeImg"
                name="bi-person-square"
                size="xl"
                color="grey"
                style="opacity: 0.5"
              />
              <template v-else>
                <div class="profile-wrap rounded-borders overflow-hidden">
                  <ImageViwer :images="[form.examineeImg]" :index="0" />
                </div>
                <div class="row justify-center q-mt-sm q-mx-auto" style="max-width: 162px">
                  <CustomButton
                    @click="$refs.imageInput.click()"
                    label="수정"
                    outline
                    color="grey"
                    class="col-xs-12 col-md-6"
                    style="padding: 3px"
                  />
                  <CustomButton
                    @click.stop="thumbDelete()"
                    label="삭제"
                    outline
                    color="grey"
                    class="col-xs-12 col-md-6"
                    style="padding: 3px"
                  />
                </div>
              </template>
              <small v-if="$route.params?.examineeId" class="reg-date">등록일 ⎮ 2025.05.23</small>
            </div>
          </div>
          <div class="col-xs-12 col-md-10">
            <div class="row q-col-gutter-md">
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">응시번호</span>
                <q-input
                  v-model="form.examineeId"
                  :readonly="$route.params?.examineeId ? true : false"
                  outlined
                  dense
                  fill
                  class="full-width bg-white"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs">
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">본인확인정보</span>
                <q-input
                  v-model="form.examineePass"
                  outlined
                  dense
                  fill
                  class="full-width bg-white"
                  :type="visible ? 'text' : 'password'"
                >
                  <template v-slot:append>
                    <q-icon
                      @click="visible = !visible"
                      :name="visible ? 'bi-unlock' : 'bi-lock'"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">본인확인정보 확인</span>
                <q-input
                  v-model="examineePassConfirm"
                  outlined
                  dense
                  fill
                  class="full-width bg-white"
                  :type="visible ? 'text' : 'password'"
                >
                  <template v-slot:append>
                    <q-icon
                      @click="visible = !visible"
                      :name="visible ? 'bi-unlock' : 'bi-lock'"
                      class="cursor-pointer"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs">
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">이름(국문)</span>
                <q-input
                  v-model="form.examineeName"
                  outlined
                  dense
                  fill
                  class="full-width bg-white"
                />
              </div>
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">이름(영문)</span>
                <q-input
                  v-model="form.examineeNameEn"
                  outlined
                  dense
                  fill
                  class="full-width bg-white"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs">
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">생년월일</span>
                <q-input
                  v-model="form.examineeBirth"
                  outlined
                  dense
                  fill
                  mask="####-##-##"
                  class="full-width bg-white"
                />
              </div>
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">성별</span>
                <q-select
                  v-model="form.examineeGender"
                  :options="[
                    { label: '남자', value: '1' },
                    { label: '여자', value: '2' },
                  ]"
                  outlined
                  dense
                  options-dense
                  emit-value
                  map-options
                  class="bg-white"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs">
              <div class="col-xs-12 col-md-6">
                <span class="form-label">이메일</span>
                <q-input
                  v-model="form.examineeEmail"
                  outlined
                  dense
                  fill
                  class="full-width bg-white"
                />
              </div>
              <div class="col-xs-12 col-md-6">
                <span class="form-label">연락처</span>
                <q-input
                  v-model="form.examineePhone"
                  outlined
                  dense
                  fill
                  mask="###-####-####"
                  class="full-width bg-white"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs">
              <div class="col-xs-12 col-md-6">
                <span class="form-label">대학</span>
                <q-input
                  v-model="form.examineeCollege"
                  outlined
                  dense
                  fill
                  class="full-width bg-white"
                />
              </div>
              <div class="col-xs-12 col-md-6">
                <span class="form-label">학과</span>
                <q-input
                  v-model="form.examineeMajor"
                  outlined
                  dense
                  fill
                  class="full-width bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="flex justify-center">
        <CustomButton @click="cancle()" label="취소" outline class="q-mr-md w-100" />
        <CustomButton @click="submit()" label="저장" class="w-100" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const router = useRouter();

const form = defineModel();

const file = ref(null);
const visible = ref(false);
const examineePassConfirm = ref('');

const imageInput = useTemplateRef('imageInput');

// 응시자 사진 선택
const render = (target) => {
  const result = $imageRender(target);

  if (result) {
    file.value = result.file;
    form.value.examineeImg = result.src;
  }
};
// 사진 클릭
const thumbClick = () => {
  if (form.value.examineeImg) return;
  imageInput.value.click();
};
// 사진 삭제
const thumbDelete = () => {
  file.value = null;
  form.value.examineeImg = '';

  if (imageInput.value) imageInput.value.value = '';
};
// 저장
const submit = async () => {
  if (!form.value.examineeId) return $showAlert('응시번호를 입력해주세요.');
  if (!form.value.examineePass) return $showAlert('본인확인정보를 입력해주세요.');
  if (form.value.examineePass != examineePassConfirm.value)
    return $showAlert('본인확인정보가 일치하지 않습니다.');
  if (!form.value.examineeName) return $showAlert('이름(국문)을 입력해주세요.');
  else if (!$validOnlyKR(form.value.examineeName))
    return $showAlert('이름(국문)은 한글로 입력해주세요.');

  if (!form.value.examineeNameEn) return $showAlert('이름(영문)을 입력해주세요.');
  else if (!$validOnlyEN(form.value.examineeNameEn))
    return $showAlert('이름(영문)은 영어로 입력해주세요.');

  // if (!form.value.companySeq) return $showAlert('회사를 선택해주세요.');

  if (!form.value.examineeBirth) return $showAlert('생년월일을 입력해주세요.');
  else if (!$validDate(form.value.examineeBirth))
    return $showAlert('정확한 생년월일을 입력해주세요.');

  if (form.value.examineeEmail && !$validEmail(form.value.examineeEmail))
    return $showAlert('이메일 형식이 아닙니다.');
  if (form.value.examineePhone && !$validTel(form.value.examineePhone))
    return $showAlert('전화번호 형식이 아닙니다.');

  if (await $showConfirm('저장하시겠습니까?')) {
    const { status } = await $saveExamineeInfo(form.value, file.value);

    if (status) {
      await router.push('/assign/examinee');
      $showAlert('저장되었습니다.');
    }
  }
};
// 취소 후 목록으로 이동
const cancle = async () => {
  if (await $showConfirm('취소하시겠습니까?')) router.push('/assign/examinee');
};
</script>

<style scoped>
.profile-wrap {
  width: 100%;
  max-width: 162px;
  margin: 0 auto;
  height: 200px;
  border: 1px solid var(--border);
  background: #fff;
}
.reg-date {
  display: block;
  margin: 8px auto 0 auto;
  text-align: center;
  color: #292929;
}
</style>
