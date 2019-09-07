import * as React from 'react';
import { render } from 'react-dom';
import App from './componets/App/App';
import { BrowserRouter as Router } from 'react-router-dom';



render(
  <Router>
    <App />
  </Router>,
  document.getElementById('app')
);

module.hot.accept();
