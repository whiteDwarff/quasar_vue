<template>
  <div ref="artRef" />
</template>

<script setup>
import Artplayer from 'artplayer';

const props = defineProps({
  // artplayer 옵션
  option: {
    type: Object,
    default: () => ({})
  },
  // 동영상 url
  url: {
    type: String,
    required: true
  }
});

const artRef = ref(null);
let instance = null;

onMounted(() => {
  if (!artRef.value) return;

  instance = new Artplayer({
    container: artRef.value,
    autoSize: false,
    fullscreen: true,
    setting: false,
    pip: false,
    playbackRate: false,
    aspectRatio: false,
    screenshot: false,
    miniProgressBar: false,
    url: props.url,
    ...props.option,
  });
});

watch(() => props.option.url, n => {
  if (instance && n) {
    instance.switch(n);
  }
});

onBeforeUnmount(() => {
  if (instance && instance.destroy) {
    instance.destroy(false);
  }
});
</script>

<style scoped>
div {
  width: 100%;
  height: 100%;
  z-index: 0;
}

:deep(.art-video-player) {
  width: 100% !important;
  height: 100% !important;
}

/* 비디오 비율 유지하며 컨테이너에 맞춤 */
:deep(.art-video) {
  object-fit: contain; 
}

/* 프로그레스바, 시간 표시, 볼륨 조절, 상단 알림 텍스트 숨기기 */
:deep(.art-control-progress),
:deep(.art-control-time),
:deep(.art-control-volume),
:deep(.art-notice) {
  display: none !important;
}
</style>
