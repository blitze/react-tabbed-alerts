var { protocol, hostname, port } = window.location;
var url = `${protocol}//${hostname}:${+port + 1}`;

/**
 * Capture tags as sub nav
 * This can be an object or a function that returns an option
 * This requires a tag and a title property
 * You can optionally use categories to only capture tags for specific categories
 * You can optionally add a captureTags property to create nested tabs
 */
var captureTags = [
	{
		tag: 'pu',
		title: 'Product Updates',
	},
	{
		tag: 'known_issue',
		title: 'Known Issues',
	},
];

export default {
	updateFrequency: 10, // in minutes
	maxHeight: 400, // in pixels
	onTabClick: () =>
		setTimeout(() => console.log('calledeeeeeeeeeeeeeeeeeeee'), 500),
	sources: [
		{
			title: 'Alerts',
			url: `${url}/alerts?_sort=updated&_order=DESC`,
			skipEventsUntilXDaysBeforeStart: 1,
			allowTracking: true,
			collectInTab: [
				// Array list of tabs to collect all posts from this source
				{
					title: 'All',
					showLabels: false,
					skipEventsUntilXDaysBeforeStart: 1,
				},
			],
			captureTags,
			archive: {
				after: 1, // days
				url: `${url}/alerts/`,
				data: {}, // any additional data to pass when submitting request to archive article
			},
		},
		{
			title: 'Product Updates',
			url: `${url}/events?_sort=updated&_order=DESC`,
			allowTracking: true,
			collectInTab: [
				// Array list of tabs to collect all posts from this source
				{
					title: 'All',
					showLabels: false,
					skipEventsUntilXDaysBeforeStart: 1,
				},
				{
					title: 'Releases',
					showLabels: true,
					skipEventsUntilXDaysBeforeStart: 0,
				},
			],
			archive: {
				after: 0, // days
				url: `${url}/alerts/`,
				dataOverwrite: function(data) {
					var index = data.tags.indexOf('alert');

					data.parent = '';
					if (index > -1) {
						data.tags.splice(index, 1);
					}

					return data;
				},
			},
		},
		{
			title: 'Resources',
			url: `${url}/featured?_sort=updated&_order=DESC`,
			captureTags: function() {
				captureTags.push({
					tag: 'alpha',
					title: 'Alpha',
					categories: ['Beauty', 'Books']
				});

				return captureTags;
			},
		},
		{
			title: 'Discussions',
			url: `${url}/discussions?_sort=updated&_order=DESC`,
			captureTags,
		},
	],
	/**
	 * We use the below to inject articles into a path in our tabs
	 * It should be of form {
	 *		[path1]: [{props}, {props}],
	 *		[path1]: [{props}, {props}],
	 * }
	 * Where path is the targetted tab + sub-tab separated by '>' e.g Programming > Javascript. Note: this is case sensitive
	 * Where props is:
	 *		[subject]: title of the post (required),
	 *		[type]: type of document (optional), This could be document, discussion, event, idea, or file. It defaults to 'document',
	 *		[id]: unique id for the post (optional),
	 *		[published]: date published in ISO 8601 format (optional)
	 *		[link]: web address (must begin with http/https/ftp protocol) to a document (optional). If this is provided, id and type are not needed
	 */
	staticPosts: {
		'Grocery > Resources': [
			{
				subject: 'Static post',
				published: '2016-05-23T01:28:14.546+0000',
			},
			{ subject: 'Static post with link', link: 'http://www.google.com' },
		],
	},
};
