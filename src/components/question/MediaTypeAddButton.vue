<template>
  <div>
    <template v-for="item of mediaType" :key="item.type">
      <q-btn 
        v-if="type.includes(item.type)"
        @click="addMediaItem(item.type)"
        :ripple="false"
        :color="mediaItems.some(({ mediaType }) => mediaType == item.type) ? 'primary' : 'grey'"
        dense 
        unelevated 
        outline
        no-caps
        class="q-py-sm q-px-md q-mr-sm"
        >
        <q-icon :name="item.icon" class="q-mr-sm" />
        <small>{{ capitalizeLetter(item.type) }}</small>
      </q-btn>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  // 등록된 미디어 목록
  mediaItems: {
    type: Array,
    default: () => []
  },
  // 화면에 표시될 미디어 타입
  mediaType: Array,
  // 등록 가능한 미디어 타입
  type: {
    type: Array,
    required: true
  },
  // 미디어 타입에 따른 시퀀스 명
  keyName: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['add']);

// 자료제시 추가
const addMediaItem = (mediaType) => {
  
  if (props.mediaItems.length < 10) {
    if (mediaType == 'text') {
      return emit('add', { [props.keyName]: null, mediaType, text: '', useFlag: 'Y' }); 
    }
    return emit('add', { [props.keyName]: null, mediaType, file: null, url: '', useFlag: 'Y' });
  } 
  
  $showAlert('최대 등록 가능한 개수는 10개입니다.');
}
// 문자열의 첫 글자를 대문자로 변환
const capitalizeLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>