import React from 'react';
import { observer } from 'mobx-react';

const _countOccurences = (search, labels) => labels.reduce((n, val) => n + (val === search), 0);

const _getLabelType = (labels) => {
	labels.sort();
	return (labels.length) ? labels[0] : '';
};

const getCounterLabelProps = ({ labels }) => {
	let label = '', text = '';
	if (labels) {
		label = _getLabelType(labels);
		text = _countOccurences(label, labels).toString();
	}

	return {label, text};
};

const getStatusLabelProps = ({ label = '' }) => ({
  label: label,
  text: label,
});

const getLabelProps = {
  'counter': getCounterLabelProps,
  'status': getStatusLabelProps,
};

function Label({ data, type }) {
  let view = null;

  const { label, text } = getLabelProps[type](data);

  if (label) {
    const typeClass = (label === 'New') ? 'danger' : ((label === 'Updated') ? 'info' : 'success');
		view = <span className={`label label-${typeClass}`}>{text}</span>;
	}

	return view;
}

export default observer(Label);
