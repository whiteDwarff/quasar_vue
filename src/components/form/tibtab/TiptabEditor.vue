<template>
  <q-card class="tiptap" flat bordered>
    <TibTabEditorMenu :editor="editor" :dir />
    <q-separator />
    <editor-content class="editor__content" :editor="editor" />
  </q-card>
</template>

<script setup>
import { onUnmounted, watch } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { Color } from '@tiptap/extension-color';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
// import Link  from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { ResizableImage } from 'tiptap-extension-resizable-image';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight';

// create a lowlight instance
const lowlight = createLowlight(all);

// you can also register languages
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);

import TibTabEditorMenu from './TibTabEditorMenu.vue';

// 상위 컴포넌트에서 v-model을 통한 바인딩
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  dir: {
    type: String,
  },
});
const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    // StarterKit 설정에서 중복되는 익스텐션을 제외
    StarterKit.configure({
      // CodeBlockLowlight를 사용
      codeBlock: false,
    }),
    Placeholder.configure({
      placeholder: '내용을 입력해주세요.',
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    ResizableImage.configure({
      defaultWidth: 200,
      defaultHeight: 200,
    }),
    // Image.configure({
    //   HTMLAttributes: {
    //     class: 'editor__image',
    //   },
    //   allowBase64: true,
    // }), // Duplicated 문제로 주석처리 (ImageResize와 중복)
    TextStyle,
    Color,
    // Underline,
    Highlight.configure({ multicolor: true }),
    TaskList, // 반드시 추가
    TaskItem.configure({
      nested: true, // 중첩 리스트 허용 여부
    }),
    // Blockquote,
    CodeBlockLowlight.configure({
      lowlight,
      enableTabIndentation: true, // 들여쓰기 활성화
      HTMLAttributes: {
        class: 'tiptab__codeblock',
      },
    }),
  ],
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
