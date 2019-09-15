import * as React from 'react';
import { render } from 'react-dom';
import Root from './components/pages/Root';
import { BrowserRouter as Router } from 'react-router-dom';

render(
  <Router>
    <Root />
  </Router>,
  document.getElementById('app'),
);

module.hot.accept();
