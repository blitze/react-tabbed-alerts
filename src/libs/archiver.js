import 'whatwg-fetch';
import { eventAccessIDs } from '../constants';
import { getDaysDiff, getDateTime } from './utils';

class Archiver {
  test(row, source, endTime, currentTime) {
    if (source.archive.after) {
      if (getDaysDiff(currentTime, endTime) / 86400000 > source.archive.after) {
        this.run(row, source);
      }
    }
  }
  run(row, { archive: { data, url } }) {
	  let postData = {
	    ...row,
	    ...data,
	  };

    if (row.type === 'event') {
      const eventData = this._getEventData(row);
      postData = {
        ...postData,
        ...eventData,
      };
    }

	  this._archive(url, row.contentID, postData);
	}
  _getEventData(row) {
    const start = getDateTime(row.startDate);
    const end = getDateTime(row.endDate);

    return {
      eventAccessID: (row.eventAccess) ? eventAccessIDs[row.eventAccess] : 0,
      maxAttendees: (!row.maxAttendees || row.maxAttendees < 1) ? 1 : row.maxAttendees,
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
    };
  }
  _archive(url, contentID, postData) {
    url += (url.charAt(url.length - 1) !== '/') ? '/' : '';

	  fetch(url + contentID, {
      method: 'PUT',
      body: JSON.stringify(postData),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }
}

export default new Archiver();
