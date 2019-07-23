import { action, extendObservable } from 'mobx';
import he from 'he';

import { urlPrefix } from '../constants';
import { getEpochTime } from '../libs/utils';
import tracker from './tracker';

class post {
	id;
	categories;
	isTracked;
	published;
	replies;
	store;
	subject;
	tags;
	type;
	link;
	updated;
	dateLabel = 'Posted';

	constructor(row, captureTags, defaultTab, isTracked) {
		this.id =
			row.id ||
			Math.random()
				.toString(36)
				.substr(2, 16);
		this.contentID = row.contentID;
		this.isTracked = isTracked;
		this.published = row.published;
		this.replies = row.replyCount || 0;
		this.subject = row.subject;
		this.type = row.type || 'document';
		this.updated = row.updated || this.published;
		this.link = row.link;

		this.startDate = row.startDate;
		this.endTime =
			this.type === 'event' && isTracked && row.endDate
				? getEpochTime(row.endDate)
				: this.timestamp;
		this.categories = row.categories || ['Misc'];
		this.tags = captureTags.reduce((a, t) => {
			const targetTag = t.tag.toLowerCase();
			if ((row.tags || []).find(x => x.toLowerCase() === targetTag)) {
				a.push(t.title);
			}
			return a;
		}, []);
		if (!this.tags.length) {
			this.tags = [defaultTab];
		}

		extendObservable(this, {
			isRead: this.isTracked && tracker.isClicked(this.id),
			get title() {
				return he.decode(this.subject);
			},
			get url() {
				return this.link
					? this.link
					: urlPrefix[this.type]
						? urlPrefix[this.type] + this.id
						: '#';
			},
			get timestamp() {
				let dateType = 'published';
				if (this.type === 'event' && this.startDate) {
					this.dateLabel = '';
					dateType = 'startDate';
				} else if (this.published !== this.updated) {
					this.dateLabel = this.isResolved ? 'Resolved' : 'Updated';
					dateType = 'updated';
				}

				return getEpochTime(this[dateType] || this.published);
			},
			get label() {
				let label = '';
				if (this.isTracked) {
					const updatedOn = getEpochTime(this.updated);

					label = 'New';
					if (this.isRead) {
						const storedData = tracker.getPost(this.id);
						label =
							updatedOn > storedData.read ||
							this.replies > storedData.replies
								? this.isResolved
									? 'Resolved'
									: 'Updated'
								: '';
					}
				}

				return label;
			},
			get isResolved() {
				const pattern = /^\[?\)?resolved/i;
				return pattern.test(this.subject);
			},
			markRead: action(() => {
				if (this.isTracked) {
					this.isRead = true;
					tracker.add(this.id, this.replies);
				}
			}),
		});
	}
}

export default post;
