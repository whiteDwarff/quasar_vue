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
            @click="console.log(1)"
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
          :nodes="nodes"
          :filter="param"
          node-key="key"
          no-nodes-label="데이터가 없습니다."
          no-results-label="검색결과가 없습니다."
          default-expand-all
          no-selection-unset
        >
          <!-- 1 depth -->
          <template v-slot:header-root="prop">
            <div class="full-width">
              <div class="flex">
                <!-- 서버에 저장된 상태일 때 v-if="prop.node.cateCode" -->
                <q-checkbox
                  @update:model-value="selectionNode"
                  v-model="selected"
                  :val="prop.node"
                />
                <q-input
                  @click.stop
                  v-model="prop.node.label"
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
            <div class="full-width">
              <div class="flex q-pl-lg">
                <q-input
                  @click.stop
                  v-model="prop.node.label"
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
            <div class="full-width">
              <div class="flex q-pl-sm">
                <q-input
                  @click.stop
                  v-model="prop.node.label"
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

// 전체선택
const toggleSelectAll = (event) => {
  selected.value = event ? nodes.value : [];
};
// 노드 항목 선택
const selectionNode = (event) => {
  isAll.value = event.length == nodes.value.length;
};
// 분류 저장
const saveCategory = async () => {
  if (!selected.value.length) return $showAlert('항목을 선택해주세요.');

  for (let root of nodes.value) {
    if (!root.label) {
      return $showAlert('대분류를 모두 입력해주세요.');
    }
    for (let middle of root.children) {
      if (!middle.label) return $showAlert('중분류를 모두 입력해주세요.');
      for (let last of middle.children)
        if (!last.label) return $showAlert('소분류를 모두 입력해주세요.');
    }
  }

  if (await $showConfirm('저장하시겠습니까?')) {
    $showAlert('저장되었습니다.');
    /*
    try {
      const res = $axios_loading.post('', {
        selected: selected.value
      });

      if(res.data.status == 200) {
        $showAlert('저장되었습니다.');
      }  
      $showAlert('저장 실패하였습니다.');
    } catch(err) {
      console.log(err);
    }
    */
  }
};

// 분류 삭제
const exceptCategory = (node, depth) => {
  if (depth == 1) {
    nodes.value = nodes.value.filter(({ key }) => key != node.key);
  } else if (depth == 2) {
    outer: for (let i = 0; i < nodes.value.length; i++) {
      if (nodes.value[i].key == node.uppr) {
        nodes.value[i].children = nodes.value[i].children.filter(({ key }) => key != node.key);
        break outer;
      }
    }
  } else {
    outer: for (let i = 0; i < nodes.value.length; i++) {
      for (let j = 0; j < nodes.value[i].children.length; j++) {
        if (nodes.value[i].children[j].key == node.uppr) {
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
  isAll.value = selected.value.length == nodes.value.length;
};
// 분류 추가
const appendCategory = (node, depth) => {
  if (depth == 1) {
    nodes.value.unshift({
      cateCode: '',
      key: crypto.randomUUID(),
      uppr: '',
      header: 'root',
      label: '',
      children: [],
    });
  } else if ([2, 3].includes(depth)) {
    const is2depth = depth == 2 ? true : false;

    const obj = {
      cateCode: '',
      key: crypto.randomUUID(),
      uppr: node.key,
      header: is2depth ? 'middle' : 'last',
      label: '',
    };
    if (is2depth) obj.children = [];
    node.children.push(obj);

    if (!expanded.value.includes(node.key)) expanded.value.push(node.key);
  }
};
</script>

<style scoped>
.action-btn {
  width: 40px;
  height: 40px;
}
</style>
