import { lazy } from 'react';

const routes = [
  {
    path: '/',
    component: lazy(() => import('./home/index')),
    name: 'home',
  }
]

export default routes