<template>
  <div class="audio-player cursor-pointer" @click="togglePlay">
    <!-- 상태에 따른 이미지 표시 -->
    <img 
      v-if="!isPlaying" 
      src="~assets/image/autio_start.png" 
      alt="Play"
      class="audio-icon"
    >
    <img 
      v-else 
      src="~assets/image/autio_stop.png" 
      alt="Stop"
      class="audio-icon"
    >
    <audio 
      ref="audioRef" 
      :src="src"  
      @ended="isPlaying = false"
      @pause="onPause"
    ></audio>
  </div>
</template>

<script>
// 전역 오디오 인스턴스 공유
const currentPlaying = ref(null);
</script>

<script setup>
const props = defineProps({
  src: {
    type: String,
    required: true
  }
});

const audioRef = ref(null);
const isPlaying = ref(false);

const togglePlay = () => {
  if (!audioRef.value) return;

  if (isPlaying.value) {
    audioRef.value.pause();
    audioRef.value.currentTime = 0;
    isPlaying.value = false;
    currentPlaying.value = null;
  } else {
    // 재생 시 다른 재생 중인 오디오들을 모두 멈춤
    if (currentPlaying.value && currentPlaying.value !== audioRef.value) {
      currentPlaying.value.pause();
      currentPlaying.value.currentTime = 0;
    }
    
    currentPlaying.value = audioRef.value;
    audioRef.value.play();
    isPlaying.value = true;
  }
};

const onPause = () => {
  isPlaying.value = false;
};

// 다른 오디오가 재생되어 이 오디오가 멈췄을 때(currentPlaying이 변경됐을 때) 상태 동기화
watch(currentPlaying, (newVal) => {
  if (newVal !== audioRef.value) {
    isPlaying.value = false;
  }
});

onBeforeUnmount(() => {
  if (currentPlaying.value === audioRef.value) {
    audioRef.value.pause();
    currentPlaying.value = null;
  }
});
</script>

<style scoped>
.audio-player {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.audio-icon {
  max-width: 60px; /* 적절한 크기로 조정 */
  max-height: 60px;
  object-fit: contain;
}
</style>
