import 'whatwg-fetch';
import { eventAccessIDs } from '../constants';
import { getPostAge, getDateTime } from './utils';

class Archiver {
	test(row, source, date) {
		if (source.archive.after) {
			if (
				getPostAge(date) >
				source.archive.after
			) {
				this.run(row, source);
			}
		}
	}
	run(
		row,
		{
			archive: { dataOverwrite, url },
		},
	) {
		let postData = { ...row, ...this._getEventData(row) };

		if (typeof overwriteDate === 'function') {
			postData = dataOverwrite(postData);
		} else if (dataOverwrite) {
			postData = { ...postData, ...dataOverwrite };
		}

		this._archive(url, row.contentID, postData);
	}
	_getEventData(row) {
		if (row.type !== 'event') {
			return {};
		}

		const start = getDateTime(row.startDate);
		const end = getDateTime(row.endDate);

		return {
			eventAccessID: row.eventAccess
				? eventAccessIDs[row.eventAccess]
				: 0,
			maxAttendees:
				!row.maxAttendees || row.maxAttendees < 1
					? 1
					: row.maxAttendees,
			startDate: start.date,
			startTime: start.time,
			endDate: end.date,
			endTime: end.time,
		};
	}
	_archive(url, contentID, postData) {
		url += url.charAt(url.length - 1) !== '/' ? '/' : '';

		/* global fetch */
		fetch(url + contentID, {
			method: 'PUT',
			body: JSON.stringify(postData),
			credentials: 'same-origin',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	}
}

export default new Archiver();
