<template>
  <q-drawer v-model="modelValue" show-if-above bordered :width="250" :breakpoint="800">
    <q-list>
      <!-- <q-item-label header> Essential Links </q-item-label> -->
      <q-list id="aside-wrap">
        <template v-for="menu of menuList" :key="menu.menuSeq">
          <router-link
            v-if="menu.menuTy == 'P'"
            @click="setStoreToCurrentMenu(menu.menuSeq, null)"
            :to="menu.menuUrl"
            :class="{ on: currentMenu.top == menu.menuSeq }"
            class="flex full-width q-py-xs q-pl-md q-py-md text-black top-menu"
          >
            <div class="q-pr-md" style="width: 55px">
              <q-icon :name="menu.icon" size="1.2rem"></q-icon>
            </div>
            {{ menu.menuNm }}</router-link
          >
          <q-expansion-item
            v-else
            :label="menu.menuNm"
            :default-opened="currentMenu.top == menu.menuSeq"
            expand-separator
            :icon="menu.icon"
            :class="{ on: currentMenu.top == menu.menuSeq }"
            group="menu"
            class="top-menu"
          >
            <q-card>
              <router-link
                v-for="child of menu.children"
                :key="child.menuSeq"
                @click="setStoreToCurrentMenu(menu.menuSeq, child.menuSeq)"
                :to="child.menuUrl"
                :class="{ on: currentMenu.child == child.menuSeq }"
                class="block full-width q-py-sm q-pl-lg text-black child"
                >{{ child.menuNm }}</router-link
              >
            </q-card>
          </q-expansion-item>
        </template>
      </q-list>
    </q-list>
  </q-drawer>
</template>

<script setup>
/*
<i class="bi bi-info"></i>  시험정보
<i class="bi bi-person"></i> 배정관리
<i class="bi bi-clock"></i> 일정관리

<i class="bi bi-bar-chart-line"></i> 결과관리
*/
import { useMenuStore } from 'src/stores/menuStore';

const store = useMenuStore();
const { menuList, currentMenu } = storeToRefs(store);

const modelValue = defineModel();

const setStoreToCurrentMenu = (topMenuSeq, childMenuSeq = null) => {
  currentMenu.value.top = topMenuSeq;
  currentMenu.value.child = childMenuSeq;
};
</script>
