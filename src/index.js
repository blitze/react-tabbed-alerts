import 'core-js/shim';
import React from 'react';
import ReactDOM from 'react-dom';

import AlertStore from './stores/alerts';
import Alerts from './components/Alerts';

import 'bootstrap/dist/css/bootstrap.css';
import './index.css';

if (process.env.NODE_ENV !== 'production') {
	window.config = require('./settings.js').default;
}

const config = window.config || {};
const maxHeight = config.maxHeight || 400;
const onTabClick = config.onTabClick || (() => null);
const alertStore = new AlertStore(config);

ReactDOM.render(
	<Alerts maxHeight={maxHeight} onTabClick={onTabClick} store={alertStore} />,
	document.getElementById('root'),
);
