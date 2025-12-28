<template>
  <div v-if="editor" id="editor__menu" class="q-pa-xs relative-position">
    <div class="flex items-center">
      <template v-if="visible.all">
        <!-- undo button -->
        <TibtapMenuButton
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().undo().run()"
          icon="sym_o_undo"
          tooltip="Undo"
        />
        <!-- redo button -->
        <TibtapMenuButton
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().chain().focus().redo().run()"
          icon="sym_o_redo"
          tooltip="Redo"
        />

        <q-separator vertical inset spaced class="separator" />

        <HeadingDropdown @selection="toggleVisible" v-model="visible.heading" :editor />
        <ListDropdown @selection="toggleVisible" v-model="visible.list" :editor />
        <TableDropdown @selection="toggleVisible" v-model="visible.table" :editor />

        <!-- blockquote -->
        <TibtapMenuButton
          @click="editor.chain().focus().toggleBlockquote().run()"
          :active="editor.isActive('blockquote')"
          icon="bi-blockquote-left"
          tooltip="Blockquote"
        />
        <!-- code block -->
        <TibtapMenuButton
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :active="editor.isActive('codeBlock')"
          icon="sym_o_code_blocks"
          tooltip="Code Block"
        />

        <q-separator vertical inset spaced class="separator" />

        <!-- bold -->
        <TibtapMenuButton
          @click="editor.chain().focus().toggleBold().run()"
          :active="editor.isActive('bold')"
          icon="bi-type-bold"
          tooltip="Bold"
        />
        <!-- italic -->
        <TibtapMenuButton
          @click="editor.chain().focus().toggleItalic().run()"
          :active="editor.isActive('italic')"
          icon="bi-type-italic"
          tooltip="Italic"
        />
        <!-- strike -->
        <TibtapMenuButton
          @click="editor.chain().focus().toggleStrike().run()"
          :active="editor.isActive('strike')"
          icon="bi-type-strikethrough"
          tooltip="Strike"
        />
        <!-- code -->
        <TibtapMenuButton
          @click="editor.chain().focus().toggleCode().run()"
          :active="editor.isActive('code')"
          icon="bi-code-slash"
          tooltip="Code"
        />
        <!-- underline -->
        <TibtapMenuButton
          @click="editor.chain().focus().toggleUnderline().run()"
          :active="editor.isActive('underline')"
          icon="bi-type-underline"
          tooltip="Underline"
        />
        <!-- highlight -->
        <TibtapMenuButton
          @click.stop="((visible.all = false), (visible.highLight = true))"
          icon="sym_o_ink_highlighter"
          tooltip="Highlight"
        />
        <!-- link -->
        <TibtapMenuButton
          @click.stop="((visible.all = false), (visible.link = true))"
          icon="bi-link-45deg"
          tooltip="Link"
          :iconStyle="{ 'margin-bottom': '-3px' }"
        />

        <q-separator vertical inset spaced class="separator" />

        <!-- superscript -->
        <TibtapMenuButton
          @click="editor.chain().focus().toggleSuperscript().run()"
          :active="editor.isActive('superscript')"
          icon="sym_o_superscript"
          tooltip="Superscript"
        />
        <!-- subscript -->
        <TibtapMenuButton
          @click="editor.chain().focus().toggleSubscript().run()"
          :active="editor.isActive('subscript')"
          icon="sym_o_subscript"
          tooltip="Subscript"
        />

        <q-separator vertical inset spaced class="separator" />

        <!-- text align -->
        <TibtapMenuButton
          @click="editor.chain().focus().setTextAlign('left').run()"
          :active="editor.isActive({ textAlign: 'left' })"
          icon="bi-text-left"
          tooltip="Align left"
        />
        <TibtapMenuButton
          @click="editor.chain().focus().setTextAlign('center').run()"
          :active="editor.isActive({ textAlign: 'center' })"
          icon="bi-text-center"
          tooltip="Align center"
        />
        <TibtapMenuButton
          @click="editor.chain().focus().setTextAlign('right').run()"
          :active="editor.isActive({ textAlign: 'right' })"
          icon="bi-text-right"
          tooltip="Align right"
        />
        <TibtapMenuButton
          @click="editor.chain().focus().setTextAlign('justify').run()"
          :active="editor.isActive({ textAlign: 'justify' })"
          icon="bi-list"
          tooltip="Align justify"
        />

        <q-separator vertical inset spaced class="separator" />

        <!-- horizontal rule -->
        <TibtapMenuButton
          @click="editor.chain().focus().setHorizontalRule().run()"
          :active="false"
          icon="sym_o_horizontal_rule"
          tooltip="Horizontal rule"
        />

        <q-separator vertical inset spaced class="separator" />

        <!-- images -->
        <TibtapMenuButton
          v-if="dir"
          @click="editorFile.click()"
          :active="false"
          icon="bi-images"
          tooltip="Images"
        >
          <!-- <span class="q-ml-xs text-weight-medium text-grey-14">Add</span> -->
        </TibtapMenuButton>
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

      <input @change="readImageURL($event)" ref="editorFile" type="file" hidden multiple />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  // editor 객체
  editor: {
    type: Object,
  },
  // 파일 저장경로
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
  table: false,
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
const editorFile = ref(null);

const readImageURL = async ({ target }) => {
  const files = target.files;
  if (files.length) {
    try {
      const fd = new FormData();
      const exts = process.env.IMAGE_EXTS.split(',');

      for (let file of files) {
        let fileName = file.name;
        let lastDot = fileName.lastIndexOf('.');
        let ext = fileName.substring(lastDot + 1, fileName.length).toLowerCase();

        if (!exts.includes(ext)) {
          return $showAlert(`${exts.join(', ')} 확장자만 등록할 수 있습니다.`);
        }

        fd.append('file', file);
      }

      // 이미지 저장 경로 설정
      fd.append('dir', props.dir);

      const res = await axiosLoading.post('/editor/imageUpload', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.status == 200) {
        const { images } = res.data.result;

        if (images.length) {
          for (let path of images) {
            let img = `<img src="http://localhost:3000${path}" class="editor__image" alt="image">`;
            props.editor.commands.insertContent(img);
          }
        }
      }
    } catch (err) {
      console.log(err);
      $showAlert(err.message);
    } finally {
      if (editorFile.value) {
        editorFile.value.value = '';
      }
    }
  }
};
onMounted(() => {
  const body = document.getElementsByTagName('body');

  if (body.length)
    body[0].addEventListener('click', () => {
      if (!visible.link) toggleVisible();
    });
});
</script>

<style scoped>
.separator {
  margin: 4px 3px !important;
}
</style>
