<template>
  <!-- 시험장 등록 -->
  <div>
    <p class="text-h6">• 1. 시험장 정보 등록</p>
    <table class="form-table">
      <colgroup>
        <col style="width: 15%" />
        <col style="width: 85%" />
      </colgroup>
      <tbody>
        <tr>
          <th>회사명 <span class="text-red">*</span></th>
          <td>
            <SelectFilter
              v-model="form.companySeq"
              :options
              hide-bottom-space
              lazy-rules
              :rules="[(val) => selectEmptyCheck(val, '회사명을')]"
            />
          </td>
        </tr>
        <tr>
          <th>시험지역</th>
          <td>
            <KakaoAdress v-model="form" :required="false" />
          </td>
        </tr>
        <tr>
          <th>시험장 <span class="text-red">*</span></th>
          <td>
            <q-input
              v-model="form.examRoomName"
              dense
              outlined
              hide-bottom-space
              lazy-rules
              :rules="[(val) => inputEmptyCheck(val, '시험장을')]"
            />
          </td>
        </tr>
        <tr>
          <th>시험장소 <span class="text-red">*</span></th>
          <td>
            <q-input
              v-model="form.examRoomAddr"
              dense
              outlined
              hide-bottom-space
              lazy-rules
              :rules="[(val) => inputEmptyCheck(val, '시험장소를')]"
            />
          </td>
        </tr>
        <tr>
          <th>시험정보</th>
          <td>
            <q-input v-model="form.examRoomInfo" dense outlined type="textarea">
              <template v-if="form.examRoomInfo" v-slot:append>
                <q-icon
                  name="cancel"
                  color="grey-5"
                  @click.stop.prevent="form.examRoomInfo = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </td>
        </tr>
        <tr>
          <th>담당자</th>
          <td>
            <q-input v-model="form.manager" dense outlined />
          </td>
        </tr>
        <tr>
          <th>담당자<br />연락처</th>
          <td>
            <q-input
              v-model="form.managerTel"
              dense
              outlined
              mask="###-####-####"
            />
          </td>
        </tr>
        <tr>
          <th>담당자 정보</th>
          <td>
            <q-input v-model="form.managerInfo" dense outlined type="textarea">
              <template v-if="form.managerInfo" v-slot:append>
                <q-icon
                  name="cancel"
                  color="grey-5"
                  @click.stop.prevent="form.managerInfo = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
          </td>
        </tr>
      </tbody>
    </table>

    <q-separator class="q-my-lg bg-grey-7" />

    <div class="flex justify-end">
      <q-btn
        type="submit"
        class="q-px-lg"
        label="저장"
        color="primary"
        unelevated
      />
      <q-btn
        @click="moveList"
        class="q-px-lg q-ml-sm"
        label="목록"
        color="grey-7"
        unelevated
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { inputEmptyCheck, selectEmptyCheck } from '/src/utils/validate-rules';

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
});

const router = useRouter();

const form = defineModel();

const moveList = () => {
  if (confirm('목록으로 이동하시겠습니까?'))
    router.push('/examinee/examRoomList');
};

onMounted(() => {
  document.getElementById('detail-addr-wrap').style.display = 'none';
});
</script>
