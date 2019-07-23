import { autorun, extendObservable } from 'mobx';
import { storageKey } from '../constants';
import storage from '../libs/storage';

class Tracker {
	constructor() {
		extendObservable(this, {
			clicked: this.load(),
		});
		this.persist();
	}
	add(id, replies) {
		this.clicked = Object.assign({}, this.clicked, {
			[id]: {
				read: +new Date(),
				replies,
			},
		});
	}
	isClicked(id) {
		return !!this.clicked[id];
	}
	isReady() {
		return !!Object.keys(this.clicked).length;
	}
	getPost(id) {
		return this.clicked[id];
	}
	update(postReplies) {
		const clickedIds = Object.keys(this.clicked);
		if (clickedIds.length) {
			for (const id of clickedIds) {
				if (postReplies[id] === undefined) {
					delete this.clicked[id];
				}
			}
		} else {
			const read = +new Date();
			const posts = Object.keys(postReplies).reduce((accumulator, id) => {
				accumulator[id] = {
					read,
					replies: postReplies[id],
				};
				return accumulator;
			}, {});
			this.clicked = posts;
		}
	}
	load() {
		return storage.get(storageKey) || {};
	}
	persist() {
		// Whenever the Json representation of the clicked articles changes, store them.
		autorun(() => {
			storage.set(storageKey, this.clicked);
		});
	}
}

export default new Tracker();
