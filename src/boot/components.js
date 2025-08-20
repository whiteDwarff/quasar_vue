import { defineBoot } from '#q-app/wrappers';
import { setCssVar } from 'quasar';

// DatePicker
import '@vuepic/vue-datepicker/dist/main.css';
import VueDatePicker from '@vuepic/vue-datepicker';

// image viewer
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';

import ElementPlus from 'element-plus';
import ElementTiptapPlugin from 'element-tiptap-vue3-fixed';
import 'element-plus/dist/index.css';
import 'element-tiptap-vue3-fixed/lib/style.css';

export default defineBoot(({ app }) => {
  app.component('VueDatePicker', VueDatePicker);

  app.use(VueViewer);
  VueViewer.setDefaults({
    zIndex: 5000,
  });

  app.use(ElementPlus);
  app.use(ElementTiptapPlugin);

  setCssVar('warning', '#ff6363');
});
