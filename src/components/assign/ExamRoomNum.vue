<template>
  <!-- 호실 등록 -->
  <div>
    <p class="text-h6">• 2. 호실 정보 등록</p>
    <table class="form-table">
      <colgroup>
        <col style="width: 20%" />
        <col style="width: 30%" />
        <col style="width: 20%" />
        <col style="width: 30%" />
      </colgroup>
      <tbody>
        <tr>
          <th>호실 <span class="text-red">*</span></th>
          <td>
            <div class="row q-col-gutter-sm">
              <q-input
                v-model="form.roomNumber"
                input-class="text-right"
                suffix="호"
                dense
                outlined
                hide-bottom-space
                lazy-rules
                :rules="[(val) => inputEmptyCheck(val, '호실을')]"
              />
            </div>
          </td>
          <th>정원 <span class="text-red">*</span></th>
          <td>
            <q-input
              v-model="form.personnelCount"
              input-class="text-right"
              suffix="명"
              dense
              outlined
              hide-bottom-space
              lazy-rules
              :rules="[(val) => inputEmptyCheck(val, '정원을')]"
              mask="#####"
            />
          </td>
        </tr>
        <tr>
          <th>자리<br />배치구성 <span class="text-red">*</span></th>
          <td colspan="3">
            <div class="flex">
              <div style="width: 46%">
                <q-input
                  v-model="form.rowCount"
                  input-class="text-right"
                  prefix="가로 :"
                  suffix="명"
                  dense
                  outlined
                  hide-bottom-space
                  lazy-rules
                  :rules="[(val) => inputEmptyCheck(val, '가로 배치인원을')]"
                  mask="####"
                />
              </div>
              <span class="q-mx-sm input-label">X</span>
              <div style="width: 46%">
                <q-input
                  v-model="form.colCount"
                  input-class="text-right"
                  prefix="세로 :"
                  suffix="명"
                  dense
                  outlined
                  hide-bottom-space
                  lazy-rules
                  :rules="[(val) => inputEmptyCheck(val, '세로 배치인원을')]"
                  mask="####"
                />
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>호실정보</th>
          <td colspan="3">
            <q-input v-model="form.examRoomNumInfo" dense outlined />
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

    <q-card-section class="q-px-none q-mt-lg">
      <q-table
        class="border-top-primary"
        :columns
        :rows="form.examRoomNum"
        row-key="examRoomCode"
        flat
        bordered
        hide-pagination
      >
        <!-- header -->
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-blue-1">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <!-- body -->
        <template v-slot:body="props">
          <q-tr :props="props" no-hover>
            <q-td style="width: 5%">
              <q-btn
                size="sm"
                color="purple-5"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              />
            </q-td>
            <q-td style="width: 20%">{{ props.row.roomNumber }}호</q-td>
            <q-td style="width: 20%">{{ props.row.personnelCount }}명</q-td>
            <q-td style="width: 40%">
              {{ props.row.rowCount }} X {{ props.row.colCount }}명<br />
              <small>(가로 X 세로)</small>
            </q-td>
            <q-td style="width: 15%">
              <q-btn
                @click="updateRoomNumInfo($event, props, false)"
                label="삭제"
                color="red-8"
                outline
              />
            </q-td>
          </q-tr>
          <!-- expand -->
          <q-tr
            v-show="props.expand"
            :props="props"
            style="background-color: rgb(245 245 245)"
            no-hover
          >
            <q-td class="border-bottom-none"> </q-td>
            <q-td class="border-bottom-none">
              <q-input
                v-model="props.row.roomNumber"
                label="호실"
                bg-color="white"
                dense
                outlined
              />
            </q-td>
            <q-td class="border-bottom-none">
              <q-input
                v-model="props.row.personnelCount"
                label="정원"
                bg-color="white"
                dense
                outlined
                mask="####"
              />
            </q-td>
            <q-td class="border-bottom-none">
              <div class="row q-col-gutter-xs">
                <q-input
                  v-model="props.row.rowCount"
                  class="col-6"
                  label="가로"
                  bg-color="white"
                  dense
                  outlined
                  mask="####"
                />
                <q-input
                  v-model="props.row.colCount"
                  class="col-6"
                  label="세로"
                  bg-color="white"
                  dense
                  outlined
                  mask="####"
                />
              </div>
            </q-td>
            <q-td class="border-bottom-none">
              <q-btn
                @click="updateRoomNumInfo($event, props, true)"
                label="수정"
                color="primary"
                outline
              />
            </q-td>
          </q-tr>
          <q-tr
            v-show="props.expand"
            :props="props"
            style="background-color: rgb(245 245 245)"
            no-hover
          >
            <q-td></q-td>
            <q-td colspan="4">
              <q-input
                v-model="props.row.examRoomNumInfo"
                label="호실정보"
                bg-color="white"
                dense
                outlined
              />
            </q-td>
          </q-tr>
        </template>
        <!-- empty  -->
        <template v-slot:no-data>
          <div class="full-width text-center">데이터가 없습니다.</div>
        </template>
      </q-table>
      <!-- pagination -->
      <BasePagination
        v-if="form.examRoomNum.length"
        v-model:page="form"
        class="q-mt-lg"
      />
    </q-card-section>
  </div>
</template>

<script setup>
import { inputEmptyCheck } from '/src/utils/validate-rules';

const emit = defineEmits(['update:examRoomNum', 'delete:examRoomNum']);

const router = useRouter();

const form = defineModel();

const updateRoomNumInfo = (e, { row }, isUpdate) => {
  if (!isUpdate && confirm('선택한 호실을 삭제하시겠습니까?'))
    emit('delete:examRoomNum', row);
  else if (isUpdate && confirm('선택한 호실을 수정하시겠습니까?')) {
    // 유효성 검사
    if (!row.roomNumber) return alert('호실을 입력해주세요.');
    if (!row.personnelCount) return alert('정원을 입력해주세요.');
    if (!row.rowCount) return alert('가로 배치인원을 입력해주세요.');
    if (!row.colCount) return alert('세로 배치인원을 입력해주세요.');

    const personnelCount = row.personnelCount;
    const totalCount = row.rowCount * row.colCount;

    if (totalCount > personnelCount)
      return alert('배치한 인원의 수가 정원 수보다 큽니다.');

    emit('update:examRoomNum', row);
  }
};

const moveList = () => {
  if (confirm('목록으로 이동하시겠습니까?'))
    router.push('/examinee/examRoomList');
};
</script>

<script>
const columns = [
  {
    label: '호실',
    name: 'roomNumber',
    field: 'roomNumber',
    align: 'center',
  },
  {
    label: '정원',
    name: 'personnelCount',
    field: 'personnelCount',
    sortable: true,
    align: 'center',
  },
  {
    label: '자리배치구성',
    name: 'seafConfig',
    field: 'seafConfig',
    align: 'center',
  },
  {
    label: '...',
    name: 'other',
    field: 'other',
    align: 'center',
  },
];
</script>
<style scoped>
.input-label {
  height: 40px;
  line-height: 40px;
}
.border-bottom-none {
  border-bottom-width: 0 !important;
}
</style>
