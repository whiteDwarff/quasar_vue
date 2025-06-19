import { defineBoot } from '#q-app/wrappers'

// DatePicker
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatePicker from '@vuepic/vue-datepicker'

export default defineBoot(({ app }) => {
  app.component('VueDatePicker', VueDatePicker)
})
