<template>
  <q-dialog @hide="resetFileInfo(false)" v-model="modelValue">
    <q-card style="width: 50rem">
      <q-card-section
        class="row items-center q-py-sm"
        style="border-bottom: 1px solid var(--border)"
      >
        <div class="text-h6">{{ header }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-mg q-px-lg">
        <p class="mb20">
          엑셀을 업로드 하여 다수의 정보를 한번에 입력할 수 있습니다.<br />
          정해진 엑셀 양식에 입력하여 업로드 하세요.
        </p>
        <p class="q-my-md">
          <b
            >등록 가능한 파일 :
            <span class="text-negative underline">{{
              exts.join(', ').replaceAll(',', '')
            }}</span></b
          >
        </p>
        <!-- 확장 가능한 슬롯 -->
        <slot></slot>
        <div
          @click="$refs.dropzone.click()"
          @drop.prevent="dropFile"
          @dragenter.stop.prevent="$event.target.classList.add('active')"
          @dragleave.stop.prevent="$event.target.classList.remove('active')"
          ondragover="event.preventDefault()"
          class="dropzone q-py-lg q-mb-md cursor-pointer"
        >
          <div class="text-grey-14 text-center" style="font-size: 12px">
            <q-icon name="bi-cloud-upload" size="lg" class="block q-mx-auto q-mb-sm" />

            <span v-if="fileName">
              {{ fileName }}
              <q-icon
                @click.stop="resetFileInfo(true)"
                name="bi-x-circle-fill"
                size="xs"
                class="q-ml-sm"
              />
            </span>
            <span v-else>클릭 또는 드래그해서 파일을 선택해 주세요.</span>
          </div>
          <input
            @change="fileChangeHandler($event.target.files)"
            ref="dropzone"
            type="file"
            :accept="exts.join(',')"
            class="none"
          />
        </div>
        <div class="flex justify-center q-mt-lg">
          <CustomButton @click="resetFileInfo(false)" label="취소" outline class="w-100 q-mr-md" />
          <CustomButton @click="submit" label="저장" class="w-100" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
const props = defineProps({
  header: {
    // dialog headers
    type: String,
    default: () => '엑셀로 업로드',
  },
  url: {
    // 엑셀 업로드 시 요청 url
    type: String,
    required: true,
  },
  data: {
    // 업로드 시 서버로 같이 보낼 데이터
    type: Object,
    default() {
      return {};
    },
  },
  exts: {
    // 선택가능한 확장자 목록
    type: Array,
    default: () => ['.xlsx'],
  },
});

defineEmits(['upload:success', 'upload:error']);

const modelValue = defineModel();

const dropzone = useTemplateRef('dropzone');
const file = ref(null);
const fileName = ref('');

// 드랍존 이벤트
const dropFile = (event) => {
  event.target.classList.remove('active');
  const { files } = event.dataTransfer || {};

  if (!files) return;
  if (files.length > 1) return $showAlert('하나의 파일만 선택해 주세요');

  fileChangeHandler(files);
};
// 파일인풋의 @change listener
const fileChangeHandler = (files) => {
  if (!files.length) return;

  if (!$validFileExt(files[0], props.exts))
    return $showAlert(`[${props.exts.join(', ')}] 파일만 등록할 수 있습니다.`);

  file.value = files[0];
  fileName.value = files[0].name;
};
// 파일 등록정보 초기화
const resetFileInfo = (visible) => {
  modelValue.value = visible;
  file.value = null;
  fileName.value = '';
  // dom 요소의 파일까지 삭제
  if (dropzone.value) {
    dropzone.value.value = '';
  }
};

const submit = async () => {
  if (!file.value) return $showAlert('파일을 업로드해주세요.');

  if (await $showConfirm('파일을 업로드 하시겠습니까?')) {
    const formData = new FormData();
    formData.append('file', file.value);
    // 데이터 추가
    for (let key of Object.keys(props.data)) formData.append(key, props.data[key]);
  }
};
</script>
