<template>
  <q-page padding>
    <q-card flat>
      <q-card-section class="q-pt-none">
        <div class="flex items-baseline location-wrap">
          <span class="title">시험분류</span>
          <q-space />
          <span class="bar">Home</span>
          <span class="bar">배정요소</span>
          <span class="current">시험분류</span>
        </div>
      </q-card-section>

      <q-card-section class="search-wrap">
        <div class="flex justify-center">
          <div class="contents input-area">
            <q-input
              v-model="param"
              :readonly="!nodes.length"
              outlined
              dense
              class="bg-white"
              placeholder="분류명을 입력하세요."
            />
          </div>
          <div class="button-area">
            <div class="flex">
              <q-space />
              <CustomButton
                :disabled="!nodes.length"
                @click="param = ''"
                label="초기화"
                :outline="true"
                class="q-mr-sm w-100"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <div class="row items-baseline edit-btn-wrap">
        <q-space />
        <div class="flex justify-end">
          <CustomButton @click="submit" :disabled="!nodes.length" label="저장" class="w-100 q-mr-xs" />
          <CustomButton @click="appendCategory(null, 1)" label="시험분류 추가" outline />
        </div>
      </div>

      <!-- nodes -->
      <div>
        <q-tree
          v-model:expanded="expanded"
          :nodes="nodes"
          :filter="param || ' '"
          :filter-method="filters"
          node-key="key"
          label-key="name"
          no-nodes-label="데이터가 없습니다."
          no-results-label="검색결과가 없습니다."
          default-expand-all
          no-selection-unset
        >
          <!-- 1 depth -->
          <template v-slot:header-root="prop">
            <div @click.stop @keypress.stop class="full-width">
              <div class="flex q-pl-md">
                <q-input
                  @click.stop
                  v-model="prop.node.name"
                  outlined
                  dense
                  :class="{
                    'bg-active': !prop.node.cateCode,
                  }"
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
              <div class="flex q-pl-md">
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
              <div class="flex q-pl-md">
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
    </q-card>
  </q-page>
</template>

<script setup>
const param = defineModel();
const nodes = defineModel('nodes');

const emit = defineEmits(['submit']);

const expanded = ref([]);

// 모든 키 추출 (펼치기용)
const getNodeKeys = (nodes, keys = []) => {
  nodes.forEach((node) => {
    if (node.children && node.children.length > 0) {
      keys.push(node.key);
      getNodeKeys(node.children, keys);
    }
  });
  return keys;
};

// 최초 로드 시 및 검색 시 전체 펼치기
watch(
  [() => nodes.value, () => param],
  ([n]) => {
    if (n.length > 0) expanded.value = getNodeKeys(n);
  },
  { immediate: true },
);
// 검색조건에 맞는 노드 필터링
const filters = (node, filterText) => {
  const isMatch = node.name.toLowerCase().includes(filterText.trim().toLowerCase());
  const isUseY = node.useFlag !== 'N';
  return isMatch && isUseY;
};

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
    node.children.push(obj);

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
        const nodesArr = root.children.find((n) => n.key === node.nodeKey);
        if (nodesArr && nodesArr.children) {
          nodesArr.children = nodesArr.children.filter(({ key }) => key !== node.key);
        }
      }
    }
  // 이미 존재하는 데이터는 트리에서 숨김
  } else setUseFlag(node);
};

// 재귀적으로 useFlag 변경
const setUseFlag = (node) => {
  node.useFlag = 'N';
  if (node.children && node.children.length) {
    node.children.forEach((child) => setUseFlag(child));
  }
};

// 저장
const submit = async () => {
  for (let root of nodes.value) {
    if (!root.name) return $showAlert('대분류를 모두 입력해주세요.');
    for (let node of root.children) {
      if (!node.name) return $showAlert('중분류를 모두 입력해주세요.');
      for (let item of node.children)
        if (!item.name) return $showAlert('소분류를 모두 입력해주세요.');
    }
  }
  if (await $showConfirm('저장하시겠습니까?')) emit('submit');
}
</script>

<style scoped>
.action-btn {
  width: 40px;
  height: 40px;
}
.bg-active {
  background: #f2f7ff;
}
</style>
