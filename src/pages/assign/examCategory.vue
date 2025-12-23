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
              <!-- <CustomButton label="검색" class="w-100" /> -->
            </div>
          </div>
        </div>
      </q-card-section>

      <div class="row items-baseline edit-btn-wrap">
        <p class="q-mt-auto">
          <q-checkbox
            @update:model-value="toggleSelectAll"
            v-model="isAll"
            :disable="!nodes.length"
            label="전체선택"
          />
        </p>
        <q-space />
        <div class="flex justify-end">
          <CustomButton
            @click="saveCategory"
            :disabled="!nodes.length"
            label="저장"
            class="w-100"
          />
          <CustomButton
            @click="updateExamCategoryUsyn"
            :disabled="!nodes.length"
            label="삭제"
            color="warning"
            outline
            class="q-mx-sm w-100"
          />
          <CustomButton @click="appendCategory(null, 1)" label="시험분류 추가" outline />
        </div>
      </div>

      <q-card-section>
        <q-tree
          v-model:expanded="expanded"
          :nodes="filteredNodes"
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
                <q-checkbox
                  @update:model-value="selectionNode"
                  v-model="selected"
                  :val="prop.node.key"
                />
                <q-input
                  @click.stop
                  v-model="prop.node.cateName"
                  outlined
                  dense
                  class="bg-white"
                  placeholder="대분류를 입력하세요."
                  style="width: calc(100% - 128px)"
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
          <template v-slot:header-middle="prop">
            <div @click.stop @keypress.stop class="full-width">
              <div class="flex q-pl-lg">
                <q-input
                  @click.stop
                  v-model="prop.node.cateName"
                  outlined
                  dense
                  class="bg-white"
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
          <template v-slot:header-last="prop">
            <div @click.stop @keypress.stop class="full-width">
              <div class="flex q-pl-sm">
                <q-input
                  @click.stop
                  v-model="prop.node.cateName"
                  outlined
                  dense
                  class="bg-white"
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
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
const param = ref('');

const expanded = ref([]);
const selected = ref([]);

const isAll = ref(false);
const nodes = ref([]);

const exceptArr = ref([]);

// 부모-자식 유지하면서 필터링
const filterNodes = (nodesArr, keyword) => {
  const filt = keyword.toLowerCase();
  return nodesArr
    .map((node) => {
      const matched = node.cateName.toLowerCase().includes(filt);

      let filteredChildren = [];
      if (node.children && node.children.length > 0) {
        filteredChildren = filterNodes(node.children, keyword);
      }
      // 부모가 매칭되면 자식 전부 유지
      if (matched) {
        return {
          ...node,
          children: node.children ? node.children.map((child) => ({ ...child })) : [],
        };
      }

      // 부모는 불일치하나 자식 중 일부가 매칭되면 매칭된 자식만 유지
      if (filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren,
        };
      }

      return null;
    })
    .filter((n) => n !== null);
};

const filteredNodes = computed(() => {
  if (!param.value) {
    return nodes.value;
  }
  return filterNodes(nodes.value, param.value);
});

// 시험분류 목록 조회
const fetchedCateInfo = async () => {
  const { data, error } = await $fetchedCateInfo();
  if (error) return $showAlert(error);
  // expanded.value = expand; // expand
  isAll.value = false;
  selected.value = [];
  nodes.value = data;
};
fetchedCateInfo();

// 전체선택
const toggleSelectAll = (event) => {
  selected.value = event ? nodes.value.map((node) => node.key) : [];
};
// 노드 항목 선택
const selectionNode = (event) => {
  isAll.value = event.length == nodes.value.length;
};
// 분류 저장
const saveCategory = async () => {
  if (!selected.value.length) return $showAlert('항목을 선택해주세요.');

  for (let root of nodes.value) {
    if (!root.cateName) {
      return $showAlert('대분류를 모두 입력해주세요.');
    }
    for (let middle of root.children) {
      if (!middle.cateName) return $showAlert('중분류를 모두 입력해주세요.');
      for (let last of middle.children)
        if (!last.cateName) return $showAlert('소분류를 모두 입력해주세요.');
    }
  }

  if (await $showConfirm('저장하시겠습니까?')) {
    const result = await $saveCateInfo({
      selected: nodes.value.filter((node) => selected.value.includes(node.key)),
      except: exceptArr.value,
    });
    if (result) return $showAlert(result);
    $showAlert('저장되었습니다.');
  }
};

// 분류 삭제
const exceptCategory = (node, depth) => {
  if (depth == 1) {
    nodes.value = nodes.value.filter(({ key }) => key != node.key);
  } else if (depth == 2) {
    outer: for (let i = 0; i < nodes.value.length; i++) {
      if (nodes.value[i].key == node.parentCode) {
        nodes.value[i].children = nodes.value[i].children.filter(({ key }) => key != node.key);
        break outer;
      }
    }
  } else {
    outer: for (let i = 0; i < nodes.value.length; i++) {
      for (let j = 0; j < nodes.value[i].children.length; j++) {
        if (nodes.value[i].children[j].key == node.sub1Code) {
          for (let k = 0; k < nodes.value[i].children[j].children.length; k++) {
            nodes.value[i].children[j].children = nodes.value[i].children[j].children.filter(
              ({ key }) => key != node.key,
            );
            break outer;
          }
        }
      }
    }
  }
  // 체크 항목에서 제거
  selected.value = selected.value.filter(({ key }) => node.key != key);
  // 체크상태 재할당
  isAll.value = selected.value.length == nodes.value.length && nodes.value.length > 0;

  if (node?.cateCode) exceptArr.value.push(node.cateCode);
};
// 분류 추가
const appendCategory = (node, depth) => {
  if (depth == 1) {
    nodes.value.unshift({
      key: crypto.randomUUID(),
      cateName: '',
      cateStep: depth,
      useFlag: 'Y',
      header: 'root',
      children: [],
    });
    // 전체선택 취소
    isAll.value = false;
  } else if ([2, 3].includes(depth)) {
    const is2depth = depth == 2 ? true : false;

    const obj = {
      key: crypto.randomUUID(),
      parentCode: is2depth ? node.key : node.parentCode,
      cateStep: depth,
      useFlag: 'Y',
      header: is2depth ? 'middle' : 'last',
      cateName: '',
    };
    if (is2depth) obj.children = [];
    else obj.sub1Code = node.key;
    node.children.push(obj);

    if (!expanded.value.includes(node.key)) expanded.value.push(node.key);
  }
};
// 삭제
const updateExamCategoryUsyn = async () => {
  if (!selected.value.length) return $showAlert('항목을 선택해주세요.');

  if (await $showConfirm('삭제하시겠습니까')) {
    const arr = selected.value.filter((item) => item?.cateCode).map((item) => item.cateCode);
    if (arr.length) {
      const { error } = await $updateExamCategoryUsyn(arr);
      if (error) return $showAlert(error);
    }
    $showAlert('삭제되었습니다.');
    await fetchedCateInfo();
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
</style>
