import React from 'react';
import { observer } from 'mobx-react';
import { Scrollbars } from 'react-custom-scrollbars';
import Timeago from 'react-timeago';

import Label from './Label';
import A from './A.js';

function TabPanel({ activeClass, content, maxHeight }) {
	return (
		<div className={`tab-pane ${activeClass}`}>
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
								{!!post.timestamp && (
									<div>
										{post.dateLabel}{' '}
										<Timeago date={post.timestamp} />
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
