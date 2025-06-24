<template>
  <div></div>
  <!-- <Dialog
    @hide="$emit('hide')"
    :draggable="false"
    :style="{ width: '50rem' }"
    :header="header"
    modal
  >
    <div id="excel-dialog">
      <p class="mb20">
        엑셀을 업로드 하여 다수의 정보를 한번에 입력할 수 있습니다.<br />정해진 엑셀 양식에 입력하여
        업로드 하세요.
      </p>
      <div v-if="yearVisible" class="wfull mb30">
        <div class="st_stit mb10"><span class="star">년도</span></div>
        <Select
          v-model="year"
          :options="$yearList(2025)"
          optionValue="id"
          optionLabel="text"
          class="nice-select d_select wfull"
          placeholder="선택"
        />
      </div>

      <p class="st_stit mb10">
        <b>등록 가능한 파일 : <span class="ext">.xlsx</span></b>
      </p>
      <div
        @click="$refs.modalExcelFile.click()"
        @drop.prevent="dropFile($event)"
        @dragenter.stop.prevent="$event.target.classList.add('active')"
        @dragleave.stop.prevent="$event.target.classList.remove('active')"
        ondragover="event.preventDefault()"
        id="excel-dropzone"
        class="file_uparea diff mb10 pointer"
      >
        <div class="file_upa_txt">클릭 또는 드래그해서 파일을 선택해 주세요.</div>
        <input
          ref="modalExcelFile"
          @change="fileHandle($event.target.files)"
          type="file"
          accept=".xlsx"
          style="display: none"
        />
      </div>
    </div>
  </Dialog> -->
</template>

<script>
/*
export default {
  props: {
    header: {
      // 모달 headers
      type: String,
      default: () => '엑셀로 업로드',
    },
    url: {
      // 엑셀 업로드 시 요청 url
      type: String,
      required: true,
    },
    data: {
      // 업로드 시 서버로 같이 보낼 데이터 (regId...)
      type: Object,
      default() {
        return {};
      },
    },
    yearVisible: {
      // 년도 선택 여부
      type: Boolean,
      default: () => true,
    },
  },
  emits: ['upload:success', 'upload:error', 'hide'],
  data() {
    return {
      file: null,
      fileName: '',
      year: this.$store.getters['getCurrentYear'].toString(),
    };
  },
  methods: {
    reset() {
      this.file = null;
      this.fileName = '';
    },
    // 엑셀 파일 드래그 방식
    dropFile(event) {
      event.target.classList.remove('active');

      const files = event.dataTransfer && event.dataTransfer.files;

      if (files != null) {
        if (files.length > 1) return this.$showAlert('하나의 파일만 선택해 주세요');
        else this.fileHandle(files);
      }
    },
    // 엑셀 파일 선택 후
    async fileHandle(files) {
      if (!files.length) return;

      if (files[0] != null && !/\.(xlsx)$/i.test(files[0].name))
        return this.$showAlert('xlsx 파일만 등록이 가능합니다.');

      this.fileName = files[0].name;

      const formData = new FormData();
      // 데이터 추가
      for (let key of Object.keys(this.data)) formData.append(key, this.data[key]);

      formData.append('year', this.year);
      formData.append('file', files[0]);

      try {
        const res = await this.$axios_loading.post(`/api/${this.url}.do`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        let message = '<div style="text-align:center">데이터를 입력해주세요.</div>';

        if (res.data.status == 200) {
          const { result } = res.data;
          this.$emit('upload:success', result);
          this.reset();
          if (result.status) {
            message = `
                <div style="text-align:center;margin:10px 0;">
                  업로드 성공
                  </div>
                `;
          } else {
            message = `
                <div style="text-align:center">
                  업로드 성공 건수 : <span class="blue">${result.successCount}</span>건<br>
                  업로드 실패 건수 :<span class="blue"> ${result.faildCount}</span>건
                  </div>
                `;
          }
          this.year = this.$store.getters['getCurrentYear'].toString();
        }
        this.$showAlert(message);
      } catch (err) {
        this.$emit('upload:error');
      } finally {
        this.$refs.modalExcelFile.value = '';
      }
    },
  },
};
*/
</script>
<style scoped>
#excel-dialog {
  padding: 20px;
  font-size: 13px;
}
#excel-dialog p {
  font-size: 14px;
}
#excel-dropzone.active {
  background: #dae9fc;
  border-color: #9cc5f7;
}
.ext {
  text-decoration: underline;
  color: rgb(225, 50, 45);
}
</style>
