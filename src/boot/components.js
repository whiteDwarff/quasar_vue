import { defineBoot } from '#q-app/wrappers';

// DatePicker
import '@vuepic/vue-datepicker/dist/main.css';
import VueDatePicker from '@vuepic/vue-datepicker';

// image viewer
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

export default defineBoot(({ app }) => {
  app.component('VueDatePicker', VueDatePicker);

  app.use(VueViewer);
  VueViewer.setDefaults({
    zIndex: 5000,
  });
});
