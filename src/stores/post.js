import { action, extendObservable } from 'mobx';
import he from 'he';

import { urlPrefix } from '../constants';
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

	constructor(row, isTracked) {
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
		this.endDate = row.endDate;
		this.categories = row.categories || ['Misc'];
		this.tags = (row.tags || []).reduce((a, x) => {
			a[x.toLowerCase()] = true;
			return a;
		}, {});

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
			get termDate() {
				return this.type === 'event' && this.endDate
					? this.endDate
					: this.isResolved
					? this.date
					: '';
			},
			get date() {
				let dateType = 'published';
				if (this.type === 'event' && this.startDate) {
					this.dateLabel = '';
					dateType = 'startDate';
				} else if (this.published !== this.updated) {
					this.dateLabel = this.isResolved ? 'Resolved' : 'Updated';
					dateType = 'updated';
				}

				return this[dateType] || this.published || '';
			},
			get label() {
				let label = '';
				if (this.isTracked) {
					label = 'New';
					if (this.isRead) {
						const storedData = tracker.getPost(this.id);
						const updatedOn = new Date(this.updated);
						const lastReadOn = new Date(storedData.read);

						label =
							updatedOn > lastReadOn ||
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
