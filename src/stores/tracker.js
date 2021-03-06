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
		this.clicked = {
            ...this.clicked,
			[id]: this.getReadMetadata(replies),
		};
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
			this.clicked = Object.keys(postReplies).reduce((accumulator, id) => {
				accumulator[id] = this.getReadMetadata(postReplies[id])
				return accumulator;
			}, {});
		}
	}
    getReadMetadata = replies => ({
        read: new Date().toISOString(),
        replies,
    })
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
