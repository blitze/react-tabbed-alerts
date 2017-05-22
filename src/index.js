import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import AlertStore from './stores/alerts';
import Alerts from './components/Alerts';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

let perfTool;
if (process.env.NODE_ENV !== 'production') {
  const ReactPerfTool = require('react-perf-tool');
  const Perf = require('react-addons-perf');

  window.config = require('./settings.js').default;
  perfTool = <ReactPerfTool perf={Perf} />;
}

const config = window.config || {};
const maxHeight = config.maxHeight || 400;
const onTabClick = config.onTabClick || (f => f);
const alertStore = new AlertStore(config);

ReactDOM.render(
  <div>
    <Alerts
      maxHeight={maxHeight}
      onTabClick={onTabClick}
      store={alertStore}
    />
    {perfTool}
  </div>,
  document.getElementById('root')
);
