import { extendShallowObservable } from 'mobx';
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
    this.config.sources = config.sources.map((source) => ({
      ...sourceTemplate,
      ...source,
    }));

    extendShallowObservable(this, {
			data: {}
    });

    this.load();
    setInterval(() => this.load(), this.config.updateFrequency * 60000);
  }

  async fetchJSON(url) {
		try {
			/* global fetch */
			let response = await fetch(url);
			let text = await response.text();
			text = await text.replace(/^throw [^;]*;/, '');
			return await JSON.parse(text);
		} catch (e) {
			console.log(e);
		}
  }

  async load() {
    const promises = this.config.sources.map((source) => this.fetchJSON(source.url));
    const results = await Promise.all(promises);
		const currentTime = +new Date();

    let repliesById = {};
		let data = {
			'All': {
				posts: [],
			},
		};

		results.forEach((srcPosts, idx) => {
			const source = this.config.sources[idx];
			const showLabels = (source.allowTracking && tracker.isReady());

			const postIds = srcPosts.list.reduce((ids, row) => {
				if (row.type === 'event' && eventIsTooFarOut(source.skipEventsUntilXDaysBeforeStart, row.startDate, currentTime)) {
					return ids;
				}

				const post = new Post(row, source.captureTags, source.title, showLabels);

				// add article to 'All' tab without labels
				if (source.showInAllTab) {
					data.All.posts.push(post);
				}

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
							data[category].subTabs[subTab] = {
								posts: [],
								labels: [],
							};
						}
						data[category].subTabs[subTab].posts.push(post);
      
						if (post.label) {
							data[category].labels.push(post.label);
							data[category].subTabs[subTab].labels.push(post.label);
						}
					}
				}

				archiver.test(row, source, post.endTime, currentTime);
				ids[post.id] = post.replies;

				return ids;
			}, {});

      if (source.allowTracking) {
        repliesById = Object.assign(repliesById, postIds);
      }
		});

		this.data = data;
    tracker.update(repliesById);
  }
}

export default Alerts;
