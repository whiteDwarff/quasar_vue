<template>
  <div>
    <template v-for="item of midiaType" :key="item.type">
      <q-btn 
        v-if="type.includes(item.type)"
        @click="addMidiaItem(item.type)"
        :ripple="false"
        :color="midiaItems.some(({ midiaType }) => midiaType == item.type) ? 'primary' : 'grey'"
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
  midiaItems: {
    type: Array,
    default: () => []
  },
  type: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['add']);

// 화면에 표시될 미디어 타입
const midiaType = ref([
  { type: 'image', icon: 'bi-images' },
  { type: 'audio', icon: 'bi-volume-up' },
  { type: 'video', icon: 'bi-camera-video' },
  { type: 'text', icon: 'bi-card-text' },
]);

/**
 * 자료제시(이미지, 오디오, 비디오, 텍스트) 항목을 추가하는 함수
 * @param {string} targetType - 추가할 미디어의 타입 
 */
const addMidiaItem = (targetType) => {
  
  if (props.midiaItems.length < 10) {
    if (targetType === 'text') {
      return emit('add', { midiaType: targetType, keyword: '' }); 
    }
    return emit('add', { midiaType: targetType, file: null });
  } 
  
  $showAlert('최대 등록 가능한 개수는 10개입니다.');
}

/**
 * 문자열의 첫 글자를 대문자로 변환하는 유틸리티 함수
 * @param {string} str - 변환할 문자열
 * @returns {string} - 첫 글자가 대문자로 변환된 문자열
 */
const capitalizeLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<style scoped></style>