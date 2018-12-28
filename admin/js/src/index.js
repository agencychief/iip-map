import React from 'react';
import ReactDOM from 'react-dom';

import MapAdminPage from './containers/MapAdminPage';

import './index.css';

ReactDOM.render(
  <MapAdminPage />,
  document.getElementById( 'iip-map-admin-page' )
);

module.hot.accept();