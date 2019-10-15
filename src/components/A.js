import React from 'react';
import { observer } from 'mobx-react';

function A({ post }) {
	return (
		<a
			href={post.url}
			target="_blank"
			rel="noopener noreferrer"
			onClick={post.markRead}
		>
			<strong>{post.title}</strong>
		</a>
	);
}

export default observer(A);
