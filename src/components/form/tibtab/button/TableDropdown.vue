<template>
  <q-btn
    @click.stop="handleClick"
    :ripple="false"
    unelevated
    size="xs"
    :color="editor.isActive('table') ? 'grey-2' : ''"
    padding="xs"
    class="hover"
    style="border-radius: 13px"
  >
    <q-icon
      name="bi-table"
      color="grey-14"
      size="xs"
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

const handleClick = () => {
    if (!props.editor.can().deleteTable()) {
        // Table does not exist (or cannot be deleted implies not in table context usually, but better check isActive)
        // actually existing check: editor.isActive('table')
        props.editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
        visible.value = false;
    } else {
        // In a table, toggle dropdown
        emit('selection', 'table');
    }
};

const tableActions = [
    { label: 'Add Col Before', icon: 'bi-layout-sidebar-inset', action: () => props.editor.chain().focus().addColumnBefore().run() },
    { label: 'Add Col After', icon: 'bi-layout-sidebar-inset-reverse', action: () => props.editor.chain().focus().addColumnAfter().run() },
    { label: 'Delete Col', icon: 'bi-layout-sidebar', action: () => props.editor.chain().focus().deleteColumn().run() },
    { label: 'Add Row Before', icon: 'bi-layout-sidebar-inset', action: () => props.editor.chain().focus().addRowBefore().run() }, 
    { label: 'Add Row After', icon: 'bi-layout-sidebar-inset-reverse', action: () => props.editor.chain().focus().addRowAfter().run() },
    { label: 'Delete Row', icon: 'bi-layout-sidebar', action: () => props.editor.chain().focus().deleteRow().run() },
    { label: 'Merge Cells', icon: 'bi-arrows-angle-contract', action: () => props.editor.chain().focus().mergeCells().run() },
    { label: 'Split Cell', icon: 'bi-arrows-angle-expand', action: () => props.editor.chain().focus().splitCell().run() },
    { label: 'Delete Table', icon: 'bi-trash', action: () => props.editor.chain().focus().deleteTable().run() },
];

</script>

<style scoped>
#wrapper {
  width: 180px;
  top: 35px;
  left: 0px;
  z-index: 10;
}
</style>
