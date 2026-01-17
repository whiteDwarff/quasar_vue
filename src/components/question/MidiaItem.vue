<template>
  <div class="flex items-center q-my-sm">
    <div v-if="item.midiaType != 'text'" class="flex items-center midia-viewer-wrap">
      <div>
        <q-badge rounded color="red" :label="getMidiTypeInfo().label" class="items-center q-mb-sm" />
        <p v-if="item.url" class="q-mb-sm midia-viewer-file">
          <span>{{ item.file?.name }}</span>
          <q-icon @click="resetFileInfo" name="bi-x-circle" size="xs" class="cursor-pointer q-ml-sm" />
        </p>
        <div class="flex items-center">
          <q-btn 
            @click="fileInput.click()"
            label="파일선택"
            color="grey-13"
            dense unelevated size="sm"
            class="q-px-sm q-mr-sm"
          />
          <input @change="validFile" ref="fileInput" type="file" class="hidden">
          <small>
            <b class="text-weight-medium">최대 크기: <span class="text-red">{{ getMidiTypeInfo().maxSize }}</span></b>
            <span class="q-ml-sm text-grey-9">({{ midiaType.exts.join(', ') }})</span>
          </small>
        </div>
        </div>
        <div v-if="item.url" class="midia-viewer shadow-1">
          <ImageViewer
            v-if="item.midiaType == 'image'"
            :images="[item.url]"
            :index="0"
          />
          <ArtPlayer v-else-if="item.midiaType == 'video'" :url="item.url" />
          <AudioPlayer
            v-else-if="item.midiaType == 'audio'"
            :src="item.url"
          ></AudioPlayer>
        </div>
    </div>
    <div v-else>

    </div>

  </div>
</template>

<script setup>
import AudioPlayer from '../common/AudioPlayer.vue';

const props = defineProps({
  // 화면에 표시될 미디어 타입 정보
  midiaType: {
    type: Object,
    required: true
  },
  // 답가지 여부
  isExample: {
    type: Boolean,
    default: () => false
  }
});

const item = defineModel();

const fileInput = ref(null);

const validFile = (e) => {
  if (!e.target.files.length) return;

  const file = e.target.files[0];

  // 등록 가능한 확장자, 파일 크기 정보
  const { exts, maxSize } = props.midiaType;

  // 등록가능한 확장자인지 확인
  if ($validFileExt(file, exts)) {
    // 파일 크기 검사
    if (file.size > maxSize) {
      resetFileInfo();
      return $showAlert(`
        등록 가능한 파일 크기는 <b class="text-red">${$formatToFileSize(maxSize)}</b> 입니다.<br/>
        현재 파일 크기 : <b>[${$formatToFileSize(file.size)}]</b>
      `);
    }
    
    // 파일 선택 시 렌더링 된 url 반환
    const render = $imageRender(e.target, exts);
    
    if (render) {
      item.value.url = render.src;
      item.value.file = file;
    } else resetFileInfo();
  } else {
    resetFileInfo();
    $showAlert(`<b>[${exts.join(', ')}]</b> 확장자만 등록할 수 있습니다.`);
  }
}
// 파일 정보 초기화 
const resetFileInfo = () => {
  item.value.file = null;
  item.value.url = '';
  if (fileInput.value.value) fileInput.value.value = '';
}
// 미디어 타입 정보 반환
const getMidiTypeInfo = () => {
  const { type, maxSize } = props.midiaType
  return {
    label: type.charAt(0).toUpperCase() + type.slice(1),
    maxSize: $formatToFileSize(maxSize)
  }
}
</script>

<style lang="scss">
.midia-viewer-wrap {
  padding: 5px 10px;
  width: 100%;
  background: #fafafa;
  border-radius: 5px;
  border: 1px solid #eaeaea;

  > div:first-child {
    width: calc(100% - 210px);
  }

  .midia-viewer-file {
    padding: 5px 10px;
    width: fit-content;
    max-width: 100%;
    word-break: break-all;
    border-radius: 19px;
    border: 1px solid #eaeaea;
    background: #fff;
  }
  .midia-viewer-file > span:hover {
    text-decoration: underline;
  }


  .midia-viewer {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    border: 1px solid #eaeaea;
    border-radius: 5px;
    width: 200px;
    height: 100px;
    background-color: #fff;
    overflow: hidden;
  
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  
    /* ArtPlayer 컴포넌트 내부의 div를 타겟팅 */
    & > div {
      width: 100% !important;
      height: 100% !important;
    }
  }

  @media all and (min-width: 501px) and (max-width: 767px) {
    > div:first-child {
      width: calc(100% - 160px);
    }
    .midia-viewer {
      width: 150px;
      height: 75px;
    }
    .midia-viewer-file > span {
      font-size: 11px;
    }
  }

  @media all and (max-width: 500px) {
    > div:first-child {
      width: calc(100% - 110px);
    }
    .midia-viewer {
      width: 100px;
      height: 100px;
    }
    .midia-viewer-file > span {
      font-size: 10px;
    }
  }
}
</style>