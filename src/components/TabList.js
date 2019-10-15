import React from 'react';
import { observer } from 'mobx-react';

import Label from './Label';

function TabList({ activeClass, id, data, title, onClick }) {
	const handleClick = e => {
		e.preventDefault();
		onClick(title);
	};

	return (
		<li className="nav-item">
			<a
				className={`nav-link ${activeClass}`}
				role="tab"
				data-toggle="tab"
				aria-controls={id}
				aria-selected={!!activeClass}
				href={`#${id}`}
				onClick={handleClick}
			>
				{title}
				<Label type="counter" data={data} />
			</a>
		</li>
	);
}

export default observer(TabList);
