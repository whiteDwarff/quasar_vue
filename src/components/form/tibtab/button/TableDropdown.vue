<template>
  <q-btn
    @click.stop="handleClick"
    :ripple="false"
    unelevated
    size="xs"
    :color="active ? 'grey-2' : ''"
    padding="xs"
    class="hover"
    style="border-radius: 13px"
  >
    <q-icon
      name="bi-table"
      :color="active ? 'deep-purple-11' : 'grey-14'"
      size="xs" style="font-size: 14px"
    />
    <q-icon name="sym_o_keyboard_arrow_down" color="grey-14" style="font-size: 11px" />
    <q-tooltip class="bg-grey">Table</q-tooltip>
  </q-btn>

  <div v-show="visible" id="wrapper" class="absolute shadow-3 bg-white editor__menu__wrap">
    <div class="q-pa-xs">
         <div
            v-for="(item, index) in tableActions"
            :key="index"
            @click="item.action"
            clickable
            v-close-popup
            class="flex items-center q-py-xs q-px-sm cursor-pointer editor__menu__item"
            style="border-radius: 6px"
        >
            <q-icon :name="item.icon" color="grey-14" size="xs" class="q-mr-xs" />
            <span class="text-grey-14">{{ item.label }}</span>
        </div>
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

const active = computed(() => props.editor.isActive('table'));

const handleClick = () => {
    if (!props.editor.can().deleteTable()) {
        props.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        visible.value = false;
    } else emit('selection', 'table');
};

const tableActions = [
    { label: 'Add Col Before', icon: 'sym_o_add_column_left', action: () => props.editor.chain().focus().addColumnBefore().run() },
    { label: 'Add Col After', icon: 'sym_o_add_column_right', action: () => props.editor.chain().focus().addColumnAfter().run() },
    { label: 'Delete Col', icon: 'sym_o_remove', action: () => props.editor.chain().focus().deleteColumn().run() },
    { label: 'Add Row Before', icon: 'sym_o_add_row_above', action: () => props.editor.chain().focus().addRowBefore().run() }, 
    { label: 'Add Row After', icon: 'sym_o_add_row_below', action: () => props.editor.chain().focus().addRowAfter().run() },
    { label: 'Delete Row', icon: 'sym_o_remove', action: () => props.editor.chain().focus().deleteRow().run() },
    { label: 'Merge Cells', icon: 'sym_o_cell_merge', action: () => props.editor.chain().focus().mergeCells().run() },
    { label: 'Split Cell', icon: 'sym_o_split_scene', action: () => props.editor.chain().focus().splitCell().run() },
    { label: 'Delete Table', icon: 'sym_o_table_convert', action: () => props.editor.chain().focus().deleteTable().run() },
];

</script>

<style scoped>
#wrapper {
  width: 180px;
  left: 170px;
}
</style>
