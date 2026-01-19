<template>
  <q-dialog v-model="visible">
    <q-card style="width: 50rem">
      <q-card-section
        class="row items-center q-py-sm"
        style="border-bottom: 1px solid var(--border)"
      >
        <div class="text-h6">이미지 생성</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-md">
        <div class="row q-col-gutter-sm q-mb-sm">
          <!-- 이미지 사이즈 -->
          <q-select
            v-model="form.size"
            :options="[
              { label: '1024px', value: 1024 },
              { label: '512px', value: 512 },
              { label: '256px', value: 256 },
            ]"
            dense
            outlined
            options-dense
            emit-value
            map-options
            class="col-xs-12 col-sm-6"
          />
          <!-- 이미지 품질 -->
          <q-select
            v-model="form.quality"
            :options="[
              { label: '속도 최적화', value: 'lower' },
              { label: '심플 백터', value: 'simple' },
              { label: '교육용 고품질 플랫', value: 'high' },
              { label: '디지털 페인팅', value: 'digital' },
              { label: '팝아트/코믹스', value: 'pop' },
            ]"
            dense
            outlined
            options-dense
            emit-value
            map-options
            class="col-xs-12 col-sm-6"
          />
        </div>

        <q-input v-model="form.prompt" dense outlined type="textarea" rows="5">
          <template v-if="form.prompt" v-slot:append>
            <q-icon
              name="cancel"
              color="grey-5"
              @click="form.prompt = ''"
              class="cursor-pointer full-height"
            />
          </template>
        </q-input>

        <div class="row q-col-gutter-sm q-my-xs">
          <div class="col-xs-12 col-sm-6">

          </div>
          <div class="row col-xs-12 col-sm-6">
            <div v-for="(image, index) of images" :key="index" class="col-4">
              <ImageViewer
                :images="images.map(m => m.fullPath)"
                :index="index"
              />
            </div>
          </div>
        </div>


      </q-card-section>

      <q-card-section class="flex justify-end q-py-sm" style="border-top: 1px solid var(--border)">
        <CustomButton @click="generateImage" label="이미지 생성" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
const visible = defineModel();

//generateImage, resetForm
const { form, images, generateImage } = useImageGen();
</script>
