import { defineRouter } from '#q-app/wrappers';
import {
  createRouter,
  //createMemoryHistory,
  createWebHistory,
  //createWebHashHistory,
} from 'vue-router';
// import routes from './routes'
import { routes } from 'vue-router/auto-routes';
import { setupLayouts } from 'virtual:generated-layouts';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  // const createHistory = process.env.SERVER
  //   ? createMemoryHistory
  //   : process.env.VUE_ROUTER_MODE === 'history'
  //     ? createWebHistory
  //     : createWebHashHistory

  const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: setupLayouts(routes),
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createWebHistory(),
  });

  return router;
});
