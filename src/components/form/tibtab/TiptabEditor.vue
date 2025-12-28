<template>
  <q-card class="tiptap" flat bordered>
    <TibTabEditorMenu :editor="editor" :dir />
    <q-separator />
    <editor-content class="editor__content" :editor="editor" :style="{ height: `${height}px` }" />
  </q-card>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import TibTabEditorMenu from './TibTabEditorMenu.vue';

import { getExtensions } from './extensions';

// 상위 컴포넌트에서 v-model을 통한 바인딩
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  dir: {
    type: String,
  },
  height: {
    type: Number,
    default: () => 400,
  },
});
const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: props.modelValue,
  extensions: getExtensions(),
  onUpdate: () => {
    emit('update:modelValue', editor.value.getHTML());
  },
});

watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.value.getHTML() === value;
    // 외부에서 사용자의 입력등으로 content가 변화되었지만 값이 같은 경우
    if (isSame) return;
    // 값이 다른 경우
    editor.value.commands.setContent(value, false);
  },
);

onUnmounted(() => {
  editor.value.destroy();
});
</script>

<style lang="scss" src="src/css/tiptab.scss"></style>

<!-- 
❗️ component 호출 
  - import TiptabEditor from 'src/components/common/tiptab/TiptabEditor.vue';
  - 서버에 이미지 저장 시 :event 프롭스 전달 필수
      • event: { type: Function }
      • event는 상위 컴포넌트에서 정의 후 prop 바인딩

❗️ component 사용
  - tiptab이 <form>에 있는 경우 @submit.prevent 필수
-----------------------------------------------------------------
  <template>
    <q-card class="tiptap" flat bordered>
      ...
      <TiptabEditor v-model="content" />
      ...
    </q-card>
  </template>
  <script setup>
  import TiptabViewer from 'src/components/tiptab/TiptabEditor.vue';
  const content = ref('');
  </script>
-----------------------------------------------------------------
-->
