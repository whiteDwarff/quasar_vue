<template>
  <div class="flex items-center">
    <!-- back -->
    <q-btn @click="cancle" unelevated :ripple="false" dense padding="xs" class="hover">
      <q-icon name="bi-arrow-left" size="xs" color="grey-14" style="font-size: 18px" />
      <q-icon name="bi-link-45deg" size="xs" color="grey-14" style="font-size: 18px" />
    </q-btn>

    <q-separator vertical inset spaced class="separator" />

    <input
      @click.stop
      v-model="link"
      type="text"
      class="q-px-sm no-border"
      style="width: 180px"
      placeholder="Paste a link.."
    />

    <StaticButton @click.stop="addLink" icon="bi-arrow-return-left" :disable="!link" :iconStyle />

    <q-separator vertical inset spaced class="separator" />

    <StaticButton
      @click.stop="validLink"
      icon="bi-box-arrow-up-right"
      :disable="!link"
      :iconStyle
    />
    <StaticButton @click.stop="link = ''" icon="bi-trash3" :disable="!link" :iconStyle />
  </div>
</template>

<script setup>
import { openURL } from 'quasar';

const emit = defineEmits(['cancle']);
const props = defineProps({
  editor: {
    type: Object,
    required: true,
  },
});

const link = ref('');

const iconStyle = reactive({
  fontSize: '14px',
});

const cancle = () => {
  link.value = '';
  emit('cancle');
};
// 입력한 주소 검증
const validLink = (isReturn) => {
  let url = link.value.trim().replace(/[ㄱ-ㅎ|ㅏ-ㅣ]/g, '');

  if (!url) return;
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

  try {
    const finalUrl = new URL(url).href;
    if (!isReturn) return finalUrl;
    else openURL(finalUrl);
  } catch (e) {
    console.error('유효하지 않은 URL 형식입니다:', e);
  }
};
// 에티터 내부에 링크 삽입
const addLink = () => {
  if (props.editor.isActive('link')) {
    props.editor.chain().focus().unsetLink().run();
    return;
  }

  const url = validLink();

  if (url === null) return;

  if (url === '') {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};
</script>

<style scoped>
.separator {
  margin: 3px !important;
}
</style>
