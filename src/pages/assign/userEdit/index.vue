<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">사용자등록</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">배정관리</span>
          <span class="current">사용자등록</span>
        </div>
      </q-card-section>

      <q-card-section class="form-wrap">
        <div class="row q-col-gutter-x-lg q-col-gutter-y-xl justify-center">
          <div class="col-xs-12 col-md-10">
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
                v-if="!form.imagePath"
                name="bi-person-square"
                size="xl"
                color="grey"
                style="opacity: 0.5"
              />
              <template v-else>
                <div class="profile-wrap rounded-borders overflow-hidden">
                  <ImageViwer :images="[form.imagePath]" :index="0" />
                </div>
                <div class="row justify-center q-mt-sm q-mx-auto" style="max-width: 162px">
                  <CustomButton
                    @click="$refs.imageInput.click()"
                    label="수정"
                    outline
                    class="col-xs-12 col-md-6"
                    color="grey"
                    style="padding: 3px"
                  />
                  <CustomButton
                    @click.stop="thumbDelete()"
                    label="삭제"
                    outline
                    class="col-xs-12 col-md-6"
                    color="grey"
                    style="padding: 3px"
                  />
                </div>
              </template>
            </div>
            <div class="row q-col-gutter-md q-my-xs justify-center">
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">구분</span>
                <div class="check-wrap full-width">
                  <q-checkbox v-model="form.userType" val="1" size="sm" label="문항출제자" />
                  <q-checkbox v-model="form.userType" val="2" size="sm" label="문항관리자" />
                  <q-checkbox v-model="form.userType" val="3" size="sm" label="채점자" />
                  <q-checkbox v-model="form.userType" val="4" size="sm" label="감독관" />
                  <q-checkbox v-model="form.userType" val="5" size="sm" label="일반관리자" />
                </div>
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs justify-center">
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">아이디</span>
                <q-input v-model="form.userId" outlined dense fill class="full-width bg-white" />
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs justify-center">
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">비밀번호</span>
                <q-input
                  v-model="form.userPass"
                  outlined
                  dense
                  fill
                  :type="form.isPwd ? 'userPass' : 'text'"
                  class="full-width bg-white"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="form.isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="form.isPwd = !form.isPwd"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs justify-center">
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">비밀번호 확인</span>
                <q-input
                  v-model="form.userPassChk"
                  outlined
                  dense
                  fill
                  :type="form.isPwd2 ? 'userPass' : 'text'"
                  class="full-width bg-white"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="form.isPwd2 ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="form.isPwd2 = !form.isPwd2"
                    />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs justify-center">
              <div class="col-xs-12 col-md-6">
                <span class="form-label star">이름</span>
                <div>
                  <q-input
                    v-model="form.userName"
                    outlined
                    dense
                    fill
                    class="full-width bg-white"
                  />
                </div>
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs justify-center">
              <div class="col-xs-12 col-md-6">
                <span class="form-label">이메일</span>
                <q-input v-model="form.email" outlined dense fill class="full-width bg-white" />
              </div>
            </div>
            <div class="row q-col-gutter-md q-my-xs justify-center">
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
            <div class="row q-col-gutter-md q-my-xs justify-center">
              <div class="col-xs-12 col-md-6">
                <span class="form-label">소속</span>
                <q-input v-model="form.dept" outlined dense fill class="full-width bg-white" />
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
  userType: [],
  userId: '',
  userName: '',
  userPass: '',
  email: '',
  tel: '',
  dept: '',
  file: null,
  imagePath: '',
});

/*
const isPwd: ref(true);
const isPwd2: ref(true);
const userPassChk: ref('');
*/
const imageInput = useTemplateRef('imageInput');
const file = ref(null);

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
  if (status) {
    if (form.value.userType.length == 0) {
      return $showAlert('구분을 선택해주세요.');
    }

    if (!form.value.userId) return $showAlert('아이디를 입력해주세요.');

    if (form.value.userPass != userPassChk.value)
    return $showAlert('비밀번호와 비밀번호 확인란이 일치하지 않습니다.');

    if (!form.value.userName) return $showAlert('이름을 입력해주세요.');
    else if (!$validOnlyKR(form.value.userName)) return $showAlert('이름은 한글로 입력해주세요.');

    if (!form.value.userNameEn) return $showAlert('이름(영문)을 입력해주세요.');
    else if (!$validOnlyEN(form.value.userNameEn))
      return $showAlert('이름(영문)은 영어로 입력해주세요.');

    if (!form.value.birth) return $showAlert('생년월일을 입력해주세요.');
    else if (!$validDate(form.value.birth)) return $showAlert('정확한 생년월일을 입력해주세요.');

    if (form.value.email && $validEmail(form.value.email))
      return $showAlert('이메일 형식이 아닙니다');
    if (form.value.tel && $validTel(form.value.tel)) return $showAlert('이메일 형식이 아닙니다');

    if (await $showConfirm('저장하시겠습니까?')) {
      const { status } = await $saveUserInfo(form.value, file.value);

      if (status) {
        await router.push('/assign/user');
        $showAlert('저장되었습니다.');
      }
    }
  }
};
// 취소 후 목록으로 이동
const cancle = async () => {
  if (await $showConfirm('취소하시겠습니까?')) router.push('/assign/user');
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
  max-width: 162px;
  margin: 10px auto 0 auto;
  text-align: center;
  color: #292929;
}
</style>

<route lang="yaml">
meta:
  layout: default
</route>
