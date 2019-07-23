import { extendObservable } from 'mobx';
import 'whatwg-fetch';

import { sourceTemplate } from '../constants';
import { eventIsTooFarOut } from '../libs/utils';
import archiver from '../libs/archiver';
import tracker from './tracker';
import Post from './post';

class Alerts {
	config;

	constructor(config) {
		this.config = config;
		this.config.sources = (config.sources || []).map(source => ({
			...sourceTemplate,
			...source,
		}));

		extendObservable(this, {
			data: {},
		});

		this.load();
		setInterval(() => this.load(), this.config.updateFrequency * 60000);
	}

	async fetchJSON(url) {
		try {
			/* global fetch */
			let response = await fetch(url, { credentials: 'same-origin' });
			let text = await response.text();
			text = await text.replace(/^throw [^;]*;/, '');
			return await JSON.parse(text);
		} catch (e) {
			console.log(e);
		}
	}

	async load() {
		let repliesById = {};
		let data = {};

		const promises = this.config.sources.map(source => {
			this._initTabData(source, data);
			return this.fetchJSON(source.url);
		});
		const results = await Promise.all(promises);
		const currentTime = +new Date();

		results.forEach((srcPosts = {}, idx) => {
			const source = this.config.sources[idx];
			const showLabels = source.allowTracking && tracker.isReady();
			let postIds = {};

			if (srcPosts.list) {
				postIds = srcPosts.list.reduce((ids, row) => {
					const post = new Post(
						row,
						source.captureTags,
						source.title,
						showLabels,
					);

					if (
						this._addToCollection(source, data, post, currentTime)
					) {
						return ids;
					}

					this._buildTabs(
						post,
						data,
						source.captureTags,
						source.title,
						showLabels,
					);

					archiver.test(row, source, post.endTime, currentTime);
					ids[post.id] = post.replies;

					return ids;
				}, postIds);
			}

			this._removeEmptyTabs(source, data);

			if (source.allowTracking) {
				repliesById = { ...repliesById, ...postIds };
			}
		});

		this.data = data;
		tracker.update(repliesById);
	}
	_initTabData(source, data) {
		source.collectInTab.forEach(tab => {
			if (tab.showLabels) {
				data[tab.title] = {
					posts: [],
					labels: [],
				};
			} else {
				data[tab.title] = {
					posts: [],
				};
			}
		});
	}
	_addToCollection(source, data, post, currentTime) {
		let skipped = 0;
		source.collectInTab.forEach(tab => {
			if (
				post.type !== 'event' ||
				!eventIsTooFarOut(
					tab.skipEventsUntilXDaysBeforeStart,
					post.startDate,
					currentTime,
				)
			) {
				data[tab.title].posts.push(post);
				if (tab.showLabels && post.label) {
					data[tab.title].labels.push(post.label);
				}
			} else {
				skipped++;
			}
		});
		return !!skipped;
	}
	_buildTabs(post, data, captureTags, sourceTitle, showLabels) {
		for (let category of post.categories) {
			if (!data[category]) {
				data[category] = {
					subTabs: {},
					labels: [],
				};
			}

			// is the article tagged with one of our targetted tags?
			for (let subTab of post.tags) {
				if (!data[category].subTabs[subTab]) {
					// do we have any static posts from config to add to this path?
					const staticPosts =
						this.config.staticPosts[`${category} > ${subTab}`] ||
						[];
					const posts = staticPosts.map(
						row =>
							new Post(row, captureTags, sourceTitle, showLabels),
					);

					data[category].subTabs[subTab] = {
						labels: [],
						posts,
					};
				}
				data[category].subTabs[subTab].posts.push(post);

				if (post.label) {
					data[category].labels.push(post.label);
					data[category].subTabs[subTab].labels.push(post.label);
				}
			}
		}
	}
	_removeEmptyTabs(source, data) {
		source.collectInTab.forEach(tab => {
			if (data[tab.title] && data[tab.title].posts.length) {
				data[tab.title].posts.sort((a, b) => b.timestamp - a.timestamp);
			} else {
				delete data[tab.title];
			}
		});
	}
}

export default Alerts;
