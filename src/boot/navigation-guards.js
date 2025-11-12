import { boot } from 'quasar/wrappers';

function requiresAuth(to) {
  const params = Object.keys(to.params);

  if (params.length && to.fullPath != '/error') {
    // for (let param of params) {
    //   if (param in to.meta.params) {
    //     const type = to.meta.params[param];
    //     if (type == 'number' && !$validNumber(to.params[param])) {
    //       return '/error';
    //     }
    //   } else return '/error';
    // }
  }
}

export default boot(async ({ router }) => {
  router.beforeEach(requiresAuth);
});
