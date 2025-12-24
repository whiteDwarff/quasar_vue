<template>
  <q-btn
    @click.stop="emit('selection', 'heading')"
    :ripple="false"
    unelevated
    size="xs"
    :color="editor.isActive('heading') ? 'grey-2' : ''"
    padding="xs"
    class="hover"
    style="border-radius: 13px"
  >
    <q-icon
      :name="!current ? 'sym_o_h_mobiledata' : `sym_o_format_h${current}`"
      :color="!current ? 'grey-14' : 'deep-purple-12'"
      size="xs"
    />
    <q-icon name="sym_o_keyboard_arrow_down" color="grey-14" style="font-size: 11px" />
    <q-tooltip class="bg-grey">Heading</q-tooltip>
  </q-btn>

  <div v-show="visible" id="wrapper" class="absolute shadow-3 bg-white editor__menu__wrap">
    <div
      v-for="i in 4"
      :key="i"
      @click="selection(i)"
      clickable
      v-close-popup
      :class="{ 'bg-grey-2': current == i }"
      class="flex items-center q-py-none q-px-sm q-my-xs cursor-pointer editor__menu__item"
      style="border-radius: 10px"
    >
      <q-icon
        :name="`sym_o_format_h${i}`"
        :color="isActive(i) ? 'deep-purple-12' : 'grey-14'"
        size="xs"
        class="q-mr-xs"
      />
      <span :class="isActive(i) ? 'grey-10 text-weight-bold' : 'text-grey-14'"
        >Heading {{ i }}</span
      >
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  editor: {
    type: Object,
  },
});

const emit = defineEmits(['selection']);

const visible = defineModel();

const current = computed(() => {
  for (let i = 1; i <= 4; i++) {
    if (props.editor.isActive('heading', { level: i })) return i;
  }
  return null;
});

const isActive = (level) => props.editor.isActive('heading', { level });

const selection = (i) => {
  props.editor.chain().focus().toggleHeading({ level: i }).run();
  visible.value = false;
};
</script>

<style scoped>
#wrapper {
  width: 120px;
  bottom: -119px;
  left: 65px;
}
</style>
