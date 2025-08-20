<template>
  <q-page padding
    >sdsd
    <el-tiptap
      ref="editorRef"
      v-model="modelValue"
      :extensions="config"
      class="tiptap-editor"
      placeholder="Write something..."
    />
    value: {{ modelValue }}
  </q-page>
</template>

<script setup>
import {
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  TextAlign,
  FontSize,
  Strike,
  BulletList,
  OrderedList,
  Table,
  Link,
  Blockquote,
  Indent,
  LineHeight,
  HorizontalRule,
  HardBreak,
  History,
  Color,
  Highlight,
  SelectAll,
  FontFamily,
  Gapcursor,
} from 'element-tiptap-vue3-fixed';

const modelValue = ref('');
const config = ref([
  History,
  Doc,
  Text,
  Paragraph,
  Heading.configure({ level: 5 }),
  FontFamily,
  Bold,
  Underline,
  Italic,
  Strike,
  FontSize,
  LineHeight,
  Color.configure({ bubble: true }),
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  BulletList,
  OrderedList,
  HorizontalRule,
  Table.configure({ resizable: true }),
  Link.configure({ openOnClick: true }),
  Blockquote,
  Indent,
  HardBreak,
  SelectAll,
  Gapcursor,
]);

onMounted(() => {
  //const editor = refs.editorRef?.editor;
  // 부모의 props와 에디터 내용이 다른 경우만
  //if (editor && modelValue.value !== editor.getHTML()) editor.commands.setContent(modelValue.value);
});
</script>

<route lang="yaml">
meta:
  layout: default
</route>
