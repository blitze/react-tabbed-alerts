import React from 'react';
import { observer } from 'mobx-react';
import Loader from 'halogen/PulseLoader';
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
			content = <Loader className="loader" color="#26A65B" size="16px" margin="4px" />;
		}

		let devTools;
		if (process.env.NODE_ENV !== 'production') {
			const DevTools = require('mobx-react-devtools').default;
			devTools = <DevTools />;
		}

		return (
			<div style={{minHeight: 200}}>
				{content}
				{devTools}
			</div>
		);
}

export default observer(Alerts);
