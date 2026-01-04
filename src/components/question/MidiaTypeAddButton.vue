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
  // 등록된 미디어 목록
  midiaItems: {
    type: Array,
    default: () => []
  },
  // 화면에 표시될 미디어 타입
  midiaType: Array,
  // 등록 가능한 미디어 타입
  type: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['add']);

// 자료제시 추가
const addMidiaItem = (targetType) => {
  
  if (props.midiaItems.length < 10) {
    if (targetType === 'text') {
      return emit('add', { midiaType: targetType, text: '' }); 
    }
    return emit('add', { midiaType: targetType, file: null, url: '' });
  } 
  
  $showAlert('최대 등록 가능한 개수는 10개입니다.');
}
// 문자열의 첫 글자를 대문자로 변환
const capitalizeLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>