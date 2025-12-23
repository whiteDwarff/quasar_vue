<template>
  <div class="row items-baseline edit-btn-wrap">
    <q-space />
    <div class="flex justify-end">
      <CustomButton :disabled="!nodes.length" label="저장" class="w-100 q-mr-xs" />
      <CustomButton @click="appendCategory(null, 1)" label="시험분류 추가" outline />
    </div>
  </div>
  <!-- nodes -->
  <div>
    <q-tree
      v-model:expanded="expanded"
      :nodes="filterNodes"
      node-key="key"
      no-nodes-label="데이터가 없습니다."
      no-results-label="검색결과가 없습니다."
      default-expand-all
      no-selection-unset
    >
      <!-- 1 depth -->
      <template v-slot:header-root="prop">
        <div @click.stop @keypress.stop class="full-width">
          <div class="flex">
            <q-input
              @click.stop
              v-model="prop.node.name"
              outlined
              dense
              :class="{
                'bg-active': !prop.node.cateCode,
                'bg-grey-2': prop.node.useFlag == 'N',
              }"
              :readonly="prop.node.useFlag == 'N'"
              placeholder="대분류를 입력하세요."
              style="width: calc(100% - 88px)"
            />

            <q-btn
              @click.stop="exceptCategory(prop.node, 1)"
              icon="bi-dash"
              rounded
              dense
              outline
              unelevated
              color="grey-7"
              class="rounded-50 q-mx-xs action-btn"
            />
            <q-btn
              @click.stop="appendCategory(prop.node, 2)"
              icon="bi-plus"
              rounded
              dense
              outline
              unelevated
              color="grey-7"
              class="rounded-50 action-btn"
            />
          </div>
        </div>
      </template>
      <!-- 2 depth -->
      <template v-slot:header-node="prop">
        <div @click.stop @keypress.stop class="full-width">
          <div class="flex q-pl-lg">
            <q-input
              @click.stop
              v-model="prop.node.name"
              outlined
              dense
              :class="{ 'bg-active': !prop.node.cateCode }"
              style="width: calc(100% - 88px)"
              placeholder="중분류를 입력하세요."
            />
            <q-btn
              @click.stop="exceptCategory(prop.node, 2)"
              icon="bi-dash"
              rounded
              dense
              outline
              unelevated
              color="grey-7"
              class="rounded-50 q-mx-xs action-btn"
            />
            <q-btn
              @click.stop="appendCategory(prop.node, 3)"
              icon="bi-plus"
              rounded
              dense
              outline
              unelevated
              color="grey-7"
              class="rounded-50 action-btn"
            />
          </div>
        </div>
      </template>
      <!-- 3 depth -->
      <template v-slot:header-item="prop">
        <div @click.stop @keypress.stop class="full-width">
          <div class="flex q-pl-sm">
            <q-input
              @click.stop
              v-model="prop.node.name"
              outlined
              dense
              :class="{ 'bg-active': !prop.node.cateCode }"
              style="width: calc(100% - 44px)"
              placeholder="소분류를 입력하세요."
            />
            <q-btn
              @click.stop="exceptCategory(prop.node, 3)"
              icon="bi-dash"
              rounded
              dense
              outline
              unelevated
              color="grey-7"
              class="rounded-50 q-ml-xs action-btn"
            />
          </div>
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script setup>
const nodes = defineModel('nodes');
const filterNodes = defineModel('filterNodes');

const expanded = ref([]);

// 분류 추가
const appendCategory = (node, depth) => {
  const key = crypto.randomUUID();

  if (depth == 1) {
    nodes.value.unshift({
      key,
      cateCode: null,
      depth,
      useFlag: 'Y',
      name: '',
      header: 'root',
      children: [],
      rootKey: null,
      nodeKey: null,
    });
  } else if ([2, 3].includes(depth)) {
    // 2depth인 경우
    const obj = {
      key,
      cateCode: null,
      depth,
      useFlag: 'Y',
      name: '',
      header: 'node',
      children: [],
      rootKey: node.key,
      nodeKey: null,
    };
    // 3depth인 경우
    if (depth == 3) {
      obj.header = 'item';
      obj.rootKey = node.rootKey;
      obj.nodeKey = node.key;

      delete obj.children;
    }
    if (!expanded.value.includes(node.key)) expanded.value.push(node.key);
  }
};

// 분류 삭제
const exceptCategory = (node, depth) => {
  if (!node.cateCode) {
    if (depth == 1) {
      nodes.value = nodes.value.filter(({ key }) => key != node.key);
    } else if (depth == 2) {
      const root = nodes.value.find((n) => n.key === node.rootKey);
      if (root && root.children) {
        root.children = root.children.filter(({ key }) => key !== node.key);
      }
    } else {
      const root = nodes.value.find((n) => n.key === node.rootKey);
      if (root && root.children) {
        const nodes = root.children.find((n) => n.key === node.nodeKey);
        if (nodes && nodes.children) {
          nodes.children = nodes.children.filter(({ key }) => key !== node.key);
        }
      }
    }
  }
};
</script>

<style scoped>
.action-btn {
  width: 40px;
  height: 40px;
}
:deep(.q-tree > .q-tree__node) {
  padding: 10px 0;
}
:deep(.q-tree > .q-tree__node:first-child) {
  padding-top: 0;
}
:deep(.q-tree > .q-tree__node:last-child) {
  padding-bottom: 0;
}
.bg-active {
  background-color: #f2f7ff;
}
</style>
