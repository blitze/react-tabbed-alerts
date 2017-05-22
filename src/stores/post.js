import { action, extendShallowObservable } from 'mobx';
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
  updated;

  constructor(row, captureTags, defaultTab, isTracked) {
    this.id = row.id;
    this.contentID = row.contentID;
    this.isTracked = isTracked;
    this.published = row.published;
    this.replies = row.replyCount;
    this.subject = row.subject;
    this.type = row.type;
    this.updated = row.updated;

    this.endTime = (this.type === 'event' && isTracked && row.endDate) ? getEpochTime(row.endDate) : this.timestamp;
    this.categories = row.categories.length ? row.categories : ['Misc'];
    this.tags = captureTags.reduce((a, t) => {
      const targetTag = t.tag.toLowerCase();
      if (row.tags.find(x => x.toLowerCase() === targetTag)) {
      	a.push(t.title);
      }
      return a;
    }, []);
    if (!this.tags.length) {
      this.tags = [defaultTab];
    }

		extendShallowObservable(this, {
      isRead: this.isTracked && tracker.isClicked(this.id),

      get title() {
        return he.decode(this.subject);
      },
    
      get link() {
        return urlPrefix[this.type] ? urlPrefix[this.type] + this.id : '#';
      },
    
      get timestamp() {
        const type = (this.datedLabel === 'Posted') ? 'published' : 'updated';
        return getEpochTime(this[type]);
      },
    
      get dateLabel() {
        let dateLabel = 'Posted';
        if (this.published !== this.updated) {
          dateLabel = this.isResolved ? 'Resolved' : 'Updated';
        }
        return dateLabel;
      },
    
      get label() {
    		let label = '';
    		if (this.isTracked) {
      		const updatedOn = getEpochTime(this.updated);
    
          label = 'New';
      		if (this.isRead) {
      			const storedData = tracker.getPost(this.id);
      			label = (updatedOn > storedData.read || this.replies > storedData.replies) ? (this.isResolved ? 'Resolved' : 'Updated') : '';
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
