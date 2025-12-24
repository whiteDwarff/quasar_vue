<template>
  <q-btn
    @click="emit('selection', 'list')"
    :ripple="false"
    unelevated
    size="xs"
    :color="current() ? 'grey-2' : ''"
    padding="xs"
    style="border-radius: 13px"
  >
    <q-icon
      :name="current() ?? 'bi-list-ul'"
      :color="!current() ? 'grey-14' : 'deep-purple-12'"
      size="xs"
    />
    <q-icon name="sym_o_keyboard_arrow_down" color="grey-14" style="font-size: 11px" />
  </q-btn>

  <div v-show="visible" id="wrapper" class="absolute shadow-3 bg-white editor__menu__wrap">
    <div
      v-for="item of listItems"
      :key="item.activeType"
      @click="selection(item)"
      clickable
      v-close-popup
      class="flex items-center q-py-none q-px-sm q-my-xs cursor-pointer editor__menu__item"
      style="border-radius: 10px"
    >
      <q-icon
        :name="item.icon"
        :color="isActive(item) ? 'deep-purple-12' : 'grey-14'"
        size="xs"
        class="q-mr-xs"
      />
      <span :class="isActive(item) ? 'grey-10 text-weight-bold' : 'text-grey-14'">{{
        item.label
      }}</span>
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

const listItems = ref([
  { label: 'Bullet List', icon: 'bi-list-ul', activeType: 'bulletList' },
  { label: 'Ordered List', icon: 'bi-list-ol', activeType: 'orderedList' },
  { label: 'Task List', icon: 'bi-list-check', activeType: 'taskList' },
]);

const selection = ({ activeType }) => {
  visible.value = false;
  if (activeType == 'bulletList') props.editor.chain().focus().toggleBulletList().run();
  else if (activeType == 'orderedList') props.editor.chain().focus().toggleOrderedList().run();
  else props.editor.chain().focus().toggleTaskList().run();
};

const isActive = ({ activeType }) => props.editor.isActive(activeType);

const current = () => {
  return listItems.value.find(({ activeType }) => props.editor.isActive(activeType))?.icon;
};
</script>

<style scoped>
#wrapper {
  width: 130px;
  bottom: -93px;
  left: 40px;
}
</style>
