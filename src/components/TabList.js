import React from 'react';
import { observer } from 'mobx-react';

import Label from './Label';

function TabList({ activeClass, data, title, onClick}) {
	const handleClick = (e) => {
	  e.preventDefault();
		onClick(title);
	};

	return (
		<li className={activeClass}>
			<a href="/" onClick={handleClick}>
				{title}
				<Label type='counter' data={data} />
			</a>
		</li>
	);
}

export default observer(TabList);
