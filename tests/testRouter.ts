import { createRouter, createWebHistory } from 'vue-router';

import { Route } from '@/types';

export const testRouter = createRouter({
  history: createWebHistory(),
  routes: [
    { name: 'test', path: '/', component: { template: 'Test' } },
    { name: 'login', path: '/login', component: { template: 'login' } },
    {
      name: Route.Domain.MY_DOMAINS,
      path: '/my-domains',
      component: { template: 'Test' },
    },
    {
      name: Route.Domain.DOMAIN_CHECKER,
      path: '/check-domain',
      component: { template: 'Test' },
    },
    {
      name: Route.Domain.TRANSFER_DOMAIN,
      path: '/transfer-domain',
      component: { template: 'Test' },
    },
    {
      name: Route.Domain.REGISTER_DOMAIN_RESOURCE,
      path: '/:domain/register',
      component: { template: 'Test' },
    },
  ],
});
