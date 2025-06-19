<template>
  <q-select
    ref="selectRef"
    @input="filter"
    @click="options = props.options"
    v-model="select"
    :options
    outlined
    dense
    options-dense
    emit-value
    map-options
    use-input
    hide-selected
    fill-input
    class="full-width bg-white"
    placeholder="선택"
  >
    <template v-slot:no-option>
      <q-item dense>
        <q-item-section> 데이터가 없습니다. </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
// v-model value
const select = defineModel()

// select options
const props = defineProps({
  options: {
    type: Array,
    default: () => [{ value: '', label: '전체' }],
    // required: true,
  },
})

// binding Object
const options = ref([...props.options])

const selectRef = ref(null)

const filter = (e) => {
  const target = e.target
  const value = e.target.value.toLowerCase().replaceAll(' ', '')

  // quasar IME 한글 이슈 해결
  selectRef.value.updateInputValue(target.value)

  if (!value) {
    options.value = props.options
    select.value = ''
    return
  }

  options.value = props.options.filter(
    ({ label }) => label.toLowerCase().replaceAll(' ', '').indexOf(value) > -1,
  )
}
</script>
