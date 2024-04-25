import { createRouter, createWebHistory } from 'vue-router';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/products',
    },
    {
      path: '/products',
      component: () => import('./Products.vue'),
    },
    {
      path: '/upload',
      component: () => import('./Upload.vue'),
    },
  ],
});
