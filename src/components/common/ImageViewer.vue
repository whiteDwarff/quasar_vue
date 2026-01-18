<template>
  <img
    @click="openImageViwer"
    :src="images[index]"
    :alt="alt"
    :style="size"
    class="cursor-pointer"
  />
</template>

<script setup>
import { api as viewerApi } from 'v-viewer';

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
  index: {
    type: Number,
    required: true,
  },
  width: {
    type: String,
  },
  height: {
    type: String,
  },
  alt: {
    type: String,
    default: () => '',
  },
});

const openImageViwer = () => {
  let images = props.images;

  if (!images.length) return;
  if (typeof images == 'string') images = [images];

  return viewerApi({
    images,
    options: {
      inline: true,
      button: true,
      navbar: true,
      title: false,
      toolbar: false,
      tooltip: false,
      movable: false,
      zoomable: true,
      transition: false,
      zIndex: 7000,
    },
  });
};

const size = ref({
  width: props?.width || '100%',
  height: props?.height || '100%',
});
</script>