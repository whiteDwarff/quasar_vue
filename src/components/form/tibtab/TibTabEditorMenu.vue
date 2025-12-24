<template>
  <div v-if="editor" id="editor__menu" class="q-pa-xs relative-position">
    <div class="flex items-center">
      <template v-if="visible.all">
        <!-- undo button -->
        <StaticButton
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()"
          icon="sym_o_undo"
          tooltip="Undo"
        />
        <!-- redo button -->
        <StaticButton
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().redo().run()"
          icon="sym_o_redo"
          tooltip="Redo"
        />

        <q-separator vertical inset spaced class="separator" />

        <HeadingDropdown @selection="toggleVisible" v-model="visible.heading" :editor />
        <ListDropdown @selection="toggleVisible" v-model="visible.list" :editor />

        <!-- blockquote -->
        <StaticButton
          @click="editor.chain().focus().toggleBlockquote().run()"
          :active="editor.isActive('blockquote')"
          icon="bi-blockquote-left"
          tooltip="Blockquote"
        />
        <!-- code block -->
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
          @click.stop="((visible.all = false), (visible.highLight = true))"
          icon="sym_o_ink_highlighter"
          tooltip="Highlight"
        />
        <!-- link -->
        <StaticButton
          @click.stop="((visible.all = false), (visible.link = true))"
          icon="bi-link-45deg"
          tooltip="Link"
          :iconStyle="{ 'margin-bottom': '-3px' }"
        />

        <q-separator vertical inset spaced class="separator" />

        <!-- superscript -->
        <StaticButton
          @click="editor.chain().focus().toggleSuperscript().run()"
          :active="editor.isActive('superscript')"
          icon="sym_o_superscript"
          tooltip="Superscript"
        />
        <!-- subscript -->
        <StaticButton
          @click="editor.chain().focus().toggleSubscript().run()"
          :active="editor.isActive('subscript')"
          icon="sym_o_subscript"
          tooltip="Subscript"
        />

        <q-separator vertical inset spaced class="separator" />

        <!-- text align -->
        <StaticButton
          @click="editor.chain().focus().setTextAlign('left').run()"
          :active="editor.isActive({ textAlign: 'left' })"
          icon="bi-text-left"
          tooltip="Align left"
        />
        <StaticButton
          @click="editor.chain().focus().setTextAlign('center').run()"
          :active="editor.isActive({ textAlign: 'center' })"
          icon="bi-text-center"
          tooltip="Align center"
        />
        <StaticButton
          @click="editor.chain().focus().setTextAlign('right').run()"
          :active="editor.isActive({ textAlign: 'right' })"
          icon="bi-text-right"
          tooltip="Align right"
        />
        <StaticButton
          @click="editor.chain().focus().setTextAlign('justify').run()"
          :active="editor.isActive({ textAlign: 'justify' })"
          icon="bi-list"
          tooltip="Align justify"
        />

        <q-separator vertical inset spaced class="separator" />

        <!-- horizontal rule -->
        <StaticButton
          @click="editor.chain().focus().setHorizontalRule().run()"
          :active="false"
          icon="sym_o_horizontal_rule"
          tooltip="Horizontal rule"
        />

        <q-separator vertical inset spaced class="separator" />

        <!-- images -->
        <StaticButton
          v-if="dir"
          @click="file.click()"
          :active="false"
          icon="bi-images"
          tooltip="Images"
        >
          <span class="q-ml-xs text-weight-medium text-grey-14">Add</span>
        </StaticButton>
      </template>

      <template v-else>
        <!-- highlight -->
        <ColorPalette
          @cancle="((visible.highLight = false), (visible.all = true))"
          v-if="visible.highLight"
          :editor
          type="highlight"
        />
        <!-- link -->
        <HyperLink
          @cancle="((visible.link = false), (visible.all = true))"
          v-else-if="visible.link"
          :editor
        />
      </template>

      <input @change="readImageURL($event)" ref="file" type="file" hidden multiple />
    </div>
  </div>
</template>

<script setup>
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
  link: false,
});
// dropdown menu toggle
const toggleVisible = (e) => {
  for (let type of Object.keys(visible)) {
    if (e == type) visible[e] = !visible[e];
    else visible[type] = false;
  }
  visible.all = true;
};

// -----------------------------------------------------------
// image upload
const file = ref(null);

const readImageURL = async ({ target }) => {
  console.log(process.env.IMAGE_EXT);
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
          // return baseNotify(`${process.env.IMAGE_EXT} 확장자만 등록 가능합니다.`, {
          //   type: 'warning',
          // });

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
onMounted(() => {
  const body = document.getElementsByTagName('body');

  if (body.length)
    body[0].addEventListener('click', () => {
      toggleVisible();
    });
});
</script>

<style scoped>
.separator {
  margin: 4px 3px !important;
}
</style>
