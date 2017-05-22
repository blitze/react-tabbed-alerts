import React from 'react';
import { observer } from 'mobx-react';
import { Scrollbars } from 'react-custom-scrollbars';
import Timeago from 'react-timeago';

import Label from './Label';
import A from './A.js';

function TabPanel({ activeClass, content, maxHeight }) {
  let tabContent = content;
	if (Array.isArray(content)) {
		let posts = content.map((post) => (
			<li key={post.id}>
				<Label type="status" data={post} />
				<A href={post.link} target="_blank" onClick={post.markRead}><strong>{post.title}</strong></A>{' '}
				<div>{post.dateLabel} <Timeago date={post.timestamp} /></div>
			</li>
		));
		tabContent = (
			<Scrollbars
				autoHeight
				autoHeightMin={0}
				autoHeightMax={maxHeight}
			>
				<ol>{posts}</ol>
			</Scrollbars>
		);
	}

	return (
		<div className={`tab-pane ${activeClass}`}>
			{tabContent}
		</div>
	);
}

export default observer(TabPanel);
