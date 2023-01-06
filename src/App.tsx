import * as React from 'react';
import { Route } from 'react-router-dom';

import routes from './routes';

export default function App() {
  return routes.map((route: any) => {
    <Route key={route.path} path={route.path} component={route.component} name={route.name}/>
  })
}