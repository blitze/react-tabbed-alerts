export const eventAccessIDs = {
	open: 0,
	closed: 1,
	private: 2,
};

export const storageKey = 'Alerts';

export const sourceTemplate = {
	title: '',
	url: '',
	allowTracking: false,
	collectInTab: [],
	captureTags: [],
	archive: {
		after: 0,
		url: '',
		dataOverwrite: {},
	},
};

export const urlPrefix = {
	document: '/docs/DOC-',
	discussion: '/thread/',
	event: '/events/',
	file: '/docs/DOC-',
	ideas: '/idea/',
};
