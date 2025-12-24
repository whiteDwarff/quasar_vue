<template>
  <div v-if="editor" id="editor__menu" class="flex flex items-center q-pa-xs relative-position">
    <template v-if="visible.all">
      <HeadingDropdown @selection="toggleVisible" v-model="visible.heading" :editor />
      <ListDropdown @selection="toggleVisible" v-model="visible.list" :editor />

      <!-- blockquote -->
      <StaticButton
        @click="editor.chain().focus().toggleBlockquote().run()"
        :active="editor.isActive('blockquote')"
        icon="bi-blockquote-left"
        tooltip="Blockquote"
      />
      <!-- codeBlock -->
      <StaticButton
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :active="editor.isActive('codeBlock')"
        icon="sym_o_code_blocks"
        tooltip="Code Block"
      />

      <q-separator vertical inset spaced class="separator" />

      <!-- bold -->
      <StaticButton
        @click="editor.chain().focus().toggleBold().run()"
        :active="editor.isActive('bold')"
        icon="bi-type-bold"
        tooltip="Bold"
      />
      <!-- italic -->
      <StaticButton
        @click="editor.chain().focus().toggleItalic().run()"
        :active="editor.isActive('italic')"
        icon="bi-type-italic"
        tooltip="Italic"
      />
      <!-- strike -->
      <StaticButton
        @click="editor.chain().focus().toggleStrike().run()"
        :active="editor.isActive('strike')"
        icon="bi-type-strikethrough"
        tooltip="Strike"
      />
      <!-- code -->
      <StaticButton
        @click="editor.chain().focus().toggleCode().run()"
        :active="editor.isActive('code')"
        icon="bi-code-slash"
        tooltip="Code"
      />
      <!-- underline -->
      <StaticButton
        @click="editor.chain().focus().toggleUnderline().run()"
        :active="editor.isActive('underline')"
        icon="bi-type-underline"
        tooltip="Underline"
      />
      <!-- highlight -->
      <StaticButton
        @click="((visible.all = false), (visible.highLight = true))"
        icon="bi-highlighter"
        tooltip="Highlight"
      />
    </template>

    <ColorPalette
      @cancle="((visible[$event] = false), (visible.all = true))"
      v-else-if="!visible.all && visible.highLight"
      :editor
      type="highlight"
    />

    <!-- text-align-->
    <q-btn flat dense :icon="icon.align" color="blue">
      <q-menu>
        <q-btn
          flat
          dense
          v-close-popup
          icon="sym_o_format_align_left"
          @click="
            (editor.chain().focus().setTextAlign('left').run(),
            (icon.align = 'sym_o_format_align_left'))
          "
        />
        <q-btn
          flat
          dense
          v-close-popup
          icon="sym_o_format_align_center"
          @click="
            (editor.chain().focus().setTextAlign('center').run(),
            (icon.align = 'sym_o_format_align_center'))
          "
        />
        <q-btn
          flat
          dense
          v-close-popup
          icon="sym_o_format_align_right"
          @click="
            (editor.chain().focus().setTextAlign('right').run(),
            (icon.align = 'sym_o_format_align_right'))
          "
        />
      </q-menu>
    </q-btn>

    <!-- hiper-link -->
    <q-btn
      flat
      dense
      icon="sym_o_link"
      @click="handleLinkMenu"
      :disabled="!editor.can().chain().focus().toggleStrike().run()"
      :color="editor.isActive('link') ? 'blue' : null"
    />

    <q-separator vertical inset spaced />
    <!-- 웹에 저장된 이미지의 URL 셋팅 -->
    <q-btn flat dense icon="sym_o_image" @click="handleImageMenu">
      <q-tooltip class="bg-grey"> 이미지 URL 입력 </q-tooltip>
    </q-btn>
    <!-- 이미지를 서버에 저장 후 서버 URL 셋팅 -->
    <q-btn v-if="dir" flat dense icon="sym_o_photo_library" @click="file.click()">
      <q-tooltip class="bg-grey"> 이미지 업로드 </q-tooltip>
    </q-btn>
    <q-separator vertical inset spaced />

    <!-- horizontal button -->
    <q-btn
      flat
      dense
      icon="sym_o_horizontal_rule"
      @click="editor.chain().focus().setHorizontalRule().run()"
    />
    <q-separator vertical inset spaced />
    <!-- undo button -->
    <q-btn
      flat
      dense
      icon="sym_o_undo"
      @click="editor.chain().focus().undo().run()"
      :disabled="!editor.can().chain().focus().undo().run()"
    />
    <!-- redo button -->
    <q-btn
      flat
      dense
      icon="sym_o_redo"
      @click="editor.chain().focus().redo().run()"
      :disabled="!editor.can().chain().focus().redo().run()"
    />
    <input ref="file" type="file" hidden multiple @change="readImageURL($event)" />
  </div>
  <div></div>
</template>

<script setup>
import { reactive } from 'vue';
import ColorPalette from './button/ColorPalette.vue';

const props = defineProps({
  editor: {
    type: Object,
  },
  dir: {
    type: String,
  },
});
// dropdown 상태
const visible = reactive({
  all: true,
  heading: false,
  list: false,
  highLight: false,
});
// dropdown menu toggle
const toggleVisible = (e) => {
  for (let type of Object.keys(visible)) {
    if (e == type) visible[e] = !visible[e];
    else visible[type] = false;
  }
  visible.all = true;
};
const icon = ref({
  align: 'sym_o_format_align_left',
});

// -----------------------------------------------------------
// insert Link
const handleLinkMenu = () => {
  if (props.editor.isActive('link')) {
    props.editor.chain().focus().unsetLink().run();
    return;
  }
  const previousUrl = props.editor.getAttributes('link').href;
  const url = window.prompt('URL', previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === '') {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  // update link
  props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};
// -----------------------------------------------------------
// image url insert
const handleImageMenu = () => {
  const url = window.prompt('이미지 URL을 입력해주세요.');
  if (url) {
    props.editor.chain().focus().setImage({ src: url }).run();
  }
};
// -----------------------------------------------------------
// image upload
const file = ref(null);

const readImageURL = async ({ target }) => {
  const images = target.files;
  if (images.length) {
    try {
      const form = new FormData();
      for (let i = 0; i < images.length; i++) {
        // 파일 유효성 검사 : jpg, jpeg, png, gif 확장자만 에디터 내부에 삽입할 수 있다.
        let fileName = images[i].name;
        let lastDot = fileName.lastIndexOf('.');
        let ext = fileName.substring(lastDot, fileName.length).toLowerCase();
        let extArr = process.env.IMAGE_EXT.split(',');

        if (!extArr.includes(ext))
          return baseNotify(`${process.env.IMAGE_EXT} 확장자만 등록 가능합니다.`, {
            type: 'warning',
          });

        form.append('images', images[i]);
      }
      // 이미지 저장 경로 설정
      // TODO:server.webMvcConfig에 해당 경로 설정 확인 **
      form.append('dir', props.dir);

      const { data } = await api.post('/system/imageUpload', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // 저장한 이미지 editor에 바인딩
      for (let image of data) {
        let uploadImg = `<img src='${
          process.env.SERVER_PORT + image.filePath
        }' class='editor__image' alt='image'> `;

        props.editor.commands.insertContent(uploadImg);
      }
    } catch {
      baseNotify('이미지 저장 실패', { type: 'warning' });
    }
  }
};

// onMounted(() => {
//   const body = document.getElementsByTagName('body');
//   body.addEventListener('click', () => {
//     for (let type of Object.keys(visible)) {
//       visible[type] = false;
//     }
//   });
// });
</script>

<style scoped>
.separator {
  margin-right: 3px !important;
  margin-left: 3px !important;
}
</style>
