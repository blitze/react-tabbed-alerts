import React from 'react';
import { observer } from 'mobx-react';
import Spinner from 'react-spinkit';
import Tabs from '../containers/Tabs';

function Alerts({ store, maxHeight, onTabClick }) {
	let content;
	if (Object.keys(store.data).length > 1) {
		content = (
			<Tabs
				data={store.data}
				display="scrollable"
				maxHeight={maxHeight}
				onTabClick={onTabClick}
			/>
		);
		onTabClick();
	} else {
		content = <Spinner name="three-bounce" color="#26A65B" />;
	}

	let devTools;
	if (process.env.NODE_ENV !== 'production') {
		const DevTools = require('mobx-react-devtools').default;
		devTools = <DevTools />;
	}

	return (
		<div style={{ minHeight: 200 }}>
			{content}
			{devTools}
		</div>
	);
}

export default observer(Alerts);
