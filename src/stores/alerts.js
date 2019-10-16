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

		results.forEach((srcPosts = {}, idx) => {
			const source = this.config.sources[idx];
			const showLabels = source.allowTracking && tracker.isReady();
			const captureTags =
				typeof source.captureTags === 'function'
					? source.captureTags()
					: source.captureTags;
			let postIds = {};

			if (srcPosts.list) {
				postIds = srcPosts.list.reduce((ids, row) => {
					const post = new Post(row, showLabels);

					if (this._addToCollection(source, data, post)) {
						return ids;
					}

					this._buildTabs(
						post,
						data,
						captureTags,
						source.title,
						showLabels,
					);

					archiver.test(row, source, post.endDate);
					ids[post.id] = post.replies;

					return ids;
				}, postIds);
			}

			this._removeEmptyTabs(source, data);

			if (source.allowTracking) {
				repliesById = { ...repliesById, ...postIds };
			}
		});

		this._addStaticPosts(data);
		this.data = data;
		tracker.update(repliesById);
	}
	_initTabData(source, data) {
		source.collectInTab.forEach(tab => {
			data[tab.title] = {
				posts: [],
				subTabs: {},
			};
			if (tab.showLabels) {
				data[tab.title].labels = [];
			}
		});
	}
	_addToCollection(source, data, post) {
		let skipped = 0;
		source.collectInTab.forEach(tab => {
			if (
				post.type !== 'event' ||
				!eventIsTooFarOut(
					tab.skipEventsUntilXDaysBeforeStart,
					post.startDate,
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
			const path = [category, sourceTitle];

			if (!data[category]) {
				data[category] = {
					subTabs: {},
					labels: [],
					posts: [],
				};
			}

			if (!data[category].subTabs[sourceTitle]) {
				data[category].subTabs[sourceTitle] = {
					subTabs: {},
					labels: [],
					posts: [],
				};
			}

			this._buildSubTabs(
				category,
				captureTags,
				post,
				data[category].subTabs[sourceTitle],
				showLabels,
				path,
				sourceTitle,
			);

			data[category].labels.push(post.label);
		}
	}
	_buildSubTabs(category, captureTags, post, data, showLabels, basePath) {
		if (captureTags) {
			for (const x of captureTags) {
				const tag = x.title;
				const path = [...basePath, tag];

				if (
					post.tags[x.tag] &&
					(!Array.isArray(x.categories) || x.categories.includes(category))
				) {
					if (!data.subTabs[tag]) {
						data.subTabs[tag] = {
							labels: [],
							posts: [],
							subTabs: {},
						};
					}

					data.subTabs[tag].posts.push(post);
					data.subTabs[tag].labels.push(post.label);

					this._buildSubTabs(
						category,
						x.captureTags,
						post,
						data.subTabs[tag].subTabs,
						showLabels,
						path,
					);
				}
			}

			data.posts.push(post);
			data.labels.push(post.label);
		}
	}
	_addStaticPosts(data) {
		for (let [pathString, staticPosts] of Object.entries(
			this.config.staticPosts,
		)) {
			const posts = staticPosts.map(row => new Post(row, false));
			const parts = pathString.split(' > ');
			const category = parts.shift();

			let ref = data[category].subTabs;
			parts.forEach(path => {
				if (!ref[path]) {
					ref[path] = {
						subTabs: {},
						labels: [],
						posts: [],
					};
				}

				ref[path].posts = [...posts, ...ref[path].posts];
				ref = ref[path].subTabs;
			});
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
