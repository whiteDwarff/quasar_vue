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
        <div class="row q-col-gutter-x-lg q-col-gutter-y-xl">
          <div class="col-xs-12 col-md-2">
            <div
              @click="thumbClick()"
              id="profile-wrap"
              class="rounded-borders flex justify-center items-center cursor-pointer"
            >
              <input
                @change="render($event.target)"
                ref="imageInput"
                type="file"
                class="none"
                accept=".jpg, .jpeg, .png"
              />
              <q-icon
                v-if="!form.imagePath"
                name="bi-person-square"
                size="xl"
                color="grey"
                style="opacity: 0.5"
              />
              <template v-else>
                <ImageViwer :images="[form.imagePath]" :index="0" />
                <div class="row q-col-gutter-x-md q-mt-sm">
                  <CustomButton
                    @click="$refs.imageInput.click()"
                    label="수정"
                    outline
                    class="col-6"
                    color="grey"
                  />
                  <CustomButton
                    @click.stop="thumbDelete()"
                    label="삭제"
                    outline
                    class="col-6"
                    color="grey"
                  />
                </div>
              </template>
            </div>
            <!-- <p class="reg-date">등록일 ⎮ 2025.05.23</p> -->
          </div>
          <div class="col-xs-12 col-md-10">
            <div class="row q-col-gutter-md">
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">사번(등록번호)</span>
                <q-input
                  v-model="form.examineeId"
                  outlined
                  dense
                  fill
                  class="full-width bg-white"
                />
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
                <span class="form-label star">생년월일</span>
                <q-input
                  v-model="form.birth"
                  outlined
                  dense
                  fill
                  mask="####-##-##"
                  class="full-width bg-white"
                />
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs">
              <div class="col-xs-12 col-md-6">
                <span class="form-label">이메일</span>
                <q-input v-model="form.email" outlined dense fill class="full-width bg-white" />
              </div>
              <div class="col-xs-12 col-md-6">
                <span class="form-label">연락처</span>
                <q-input
                  v-model="form.tel"
                  outlined
                  dense
                  fill
                  mask="###-####-####"
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

const form = ref({
  examineeId: '',
  examineeNameEn: '',
  examineeName: '',
  companySeq: '',
  birth: '',
  email: '',
  tel: '',
  file: null,
  imagePath: '',
});

const imageInput = useTemplateRef('imageInput');

// 응시자 사진 선택
const render = (target) => {
  const result = $imageRender(target);

  if (result) {
    form.value.file = result.file;
    form.value.imagePath = result.src;
  }
};
// 사진 클릭
const thumbClick = () => {
  if (form.value.imagePath) return;
  imageInput.value.click();
};
// 사진 삭제
const thumbDelete = () => {
  form.value.file = null;
  form.value.imagePath = '';

  if (imageInput.value) imageInput.value.value = '';
};
// 저장
const submit = async () => {
  const status = await $showConfirm('저장하시겠습니까?');

  if (status) {
    if (!form.value.examineeName) return $showAlert('이름(국문)을 입력해주세요.');
    else if (!$validOnlyKR(form.value.examineeName))
      return $showAlert('이름(국문)은 한글로 입력해주세요.');

    if (!form.value.examineeNameEn) return $showAlert('이름(영문)을 입력해주세요.');
    else if (!$validOnlyEN(form.value.examineeNameEn))
      return $showAlert('이름(영문)은 영어로 입력해주세요.');

    if (!form.value.companySeq) return $showAlert('회사를 선택해주세요.');

    if (!form.value.birth) return $showAlert('생년월일을 입력해주세요.');
    else if (!$validDate(form.value.birth)) return $showAlert('정확한 생년월일을 입력해주세요.');

    if (form.value.email && $validEmail(form.value.email))
      return $showAlert('이메일 형식이 아닙니다');
    if (form.value.tel && $validTel(form.value.tel)) return $showAlert('이메일 형식이 아닙니다');
  }
};
// 취소 후 목록으로 이동
const cancle = async () => {
  if (await $showConfirm('취소하시겠습니까?')) router.push('/assign/examinee');
};
</script>

<style scoped>
#profile-wrap {
  width: 100%;
  max-width: 162px;
  margin: 0 auto;
  height: 200px;
  border: 1px solid var(--border);
  background: #fff;
}
.reg-date {
  max-width: 162px;
  margin: 10px auto 0 auto;
  text-align: center;
  color: #292929;
}
</style>
