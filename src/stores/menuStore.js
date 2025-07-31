import { defineStore } from 'pinia';

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menuList = reactive([
      {
        menuSeq: 1,
        menuNm: '시험정보',
        menuUrl: '/examInfo',
        icon: 'bi-info-lg',
        menuTy: 'P',
        depth: 1,
      },
      {
        menuSeq: 2,
        menuNm: '배정요소',
        icon: 'bi-person',
        menuTy: 'D',
        depth: 1,
        children: [
          {
            menuSeq: 3,
            menuNm: '응시자관리',
            menuUrl: '/assign',
            menuTy: 'P',
            depth: 2,
          },
          {
            menuSeq: 4,
            menuNm: '장소관리',
            menuUrl: '/assign/location',
            menuTy: 'P',
            depth: 2,
          },
          {
            menuSeq: 5,
            menuNm: '관리자 관리',
            menuUrl: '/assign/manager',
            menuTy: 'P',
            depth: 2,
          },
          {
            menuSeq: 6,
            menuNm: '설문 관리',
            menuUrl: '/assign/survey',
            menuTy: 'P',
            depth: 2,
          },
          {
            menuSeq: 7,
            menuNm: '시험분류',
            menuUrl: '/assign/examCategory',
            menuTy: 'P',
            depth: 2,
          },
          {
            menuSeq: 8,
            menuNm: '교과목분류',
            menuUrl: '/assign/subjectCategory',
            menuTy: 'P',
            depth: 2,
          },
        ],
      },
      {
        menuSeq: 9,
        menuNm: '일정관리',
        icon: 'bi-clock',
        menuTy: 'D',
        depth: 1,
        children: [
          {
            menuSeq: 10,
            menuNm: '일정등록',
            menuUrl: '/schedule',
            menuTy: 'P',
            depth: 2,
          },
          {
            menuSeq: 11,
            menuNm: '일정관리',
            menuUrl: '/schedule/mngr',
            menuTy: 'P',
            depth: 2,
          },
        ],
      },
    ]);

    const currentMenu = reactive({
      top: null,
      child: null,
    });

    return {
      menuList,
      currentMenu,
    };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
);
