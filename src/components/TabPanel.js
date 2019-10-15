import React from 'react';
import { observer } from 'mobx-react';
import { Scrollbars } from 'react-custom-scrollbars';
import Timeago from 'react-timeago';

import Label from './Label';
import A from './A.js';

function showDateTime(dateString) {
	const isoDate = dateString.replace(/\+.+/, 'Z');
	return new Date(isoDate).toLocaleString();
}

function TabPanel({ activeClass, id, content, maxHeight }) {
	const className = ['tab-pane', activeClass].filter(Boolean).join(' ');

	return (
		<div
			className={className}
			id={id}
			role="tabpanel"
			aria-labelledby={`${id}-tab`}
		>
			{Array.isArray(content) ? (
				<Scrollbars
					autoHeight
					autoHeightMin={0}
					autoHeightMax={maxHeight}
				>
					<ol>
						{content.map(post => (
							<li key={post.id}>
								<Label type="status" data={post} />
								<A post={post} />
								{!!post.date && (
									<div>
										{post.dateLabel}{' '}
										<Timeago
											date={post.date}
											title={showDateTime(post.date)}
										/>
									</div>
								)}
							</li>
						))}
					</ol>
				</Scrollbars>
			) : (
				content
			)}
		</div>
	);
}

export default observer(TabPanel);
