<template>
  <q-btn
    @click="visible = !visible"
    :ripple="false"
    unelevated
    size="sm"
    :color="editor.isActive('heading') ? 'grey-2' : ''"
    padding="xs"
    style="border-radius: 13px"
  >
    <q-icon
      :name="!current ? 'sym_o_h_mobiledata' : `sym_o_format_h${current}`"
      :color="!current ? 'grey-14' : 'deep-purple-12'"
      size="sm"
    />
    <q-icon name="sym_o_keyboard_arrow_down" color="grey-14" style="font-size: 11px" />
  </q-btn>

  <div v-show="visible" class="absolute shadow-3 bg-white editor__menu__wrap">
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
        size="sm"
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

const visible = ref(false);

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
