<template>
  <div class="flex items-center">
    <!-- back -->
    <q-btn
      @click="emit('cancle', type)"
      unelevated
      :ripple="false"
      dense
      padding="xs"
      class="hover"
    >
      <q-icon name="bi-arrow-left" size="xs" color="grey-14" style="font-size: 18px" />
      <q-icon name="sym_o_ink_highlighter" size="xs" color="grey-14" style="font-size: 18px" />
    </q-btn>

    <q-separator vertical inset spaced class="separator" />

    <!-- colors -->
    <q-btn
      v-for="color of colors"
      :key="color.background"
      @click.stop="toggleColor(color.background)"
      :color="isActive(color.background) ? 'grey-2' : ''"
      unelevated
      :ripple="false"
      dense
      padding="xs"
      class="hover"
    >
      <span
        class="colors"
        :style="`background: ${color.background}; border: 1px solid ${color.border}`"
      >
      </span>
      <q-tooltip class="bg-grey">{{ color.tooltip }}</q-tooltip>
    </q-btn>

    <q-separator vertical inset spaced class="separator" />

    <!-- unset -->
    <TibtapMenuButton
      @click.stop="unsetColor"
      :color="!editor.isActive(type) ? 'grey-2' : ''"
      icon="bi-slash-circle"
    />
  </div>
</template>

<script setup>
const emit = defineEmits(['cancle']);
const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const colors = ref([
  { background: '#dcfce7', border: '#c2efd1', tooltip: 'Green background' },
  { background: '#e0f2fe', border: '#c6e3f8', tooltip: 'Blue background' },
  { background: '#ffe4e6', border: '#fad3d6', tooltip: 'Red background' },
  { background: '#f3e8ff', border: '#e0cff3', tooltip: 'Purple background' },
  { background: '#fef9c3', border: '#eae4a6', tooltip: 'Yellow background' },
]);

// 활성화 여부 반환
const isActive = (color) => {
  return props.editor.isActive(props.type, { color });
};
// 색상 적용 해제
const unsetColor = () => {
  const isTextStyle = props.type == 'textStyle';
  if (isTextStyle)
    // 이미 해당 색상이면 색상 제거
    props.editor.chain().focus().unsetColor().run();
  else props.editor.chain().focus().unsetHighlight().run();
};
// 색상 적용 및 해제
const toggleColor = (color) => {
  const isTextStyle = props.type == 'textStyle';
  if (props.editor.isActive(props.type, { color })) {
    unsetColor();
  } else {
    if (isTextStyle)
      // 해당 색상 적용
      props.editor.chain().focus().setColor(color).run();
    else props.editor.chain().focus().setHighlight({ color }).run();
  }
};
</script>

<style scoped>
.colors {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.separator {
  margin: 3px !important;
}
</style>
