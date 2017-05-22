const { protocol, hostname, port } = window.location;
const url = `${protocol}//${hostname}:${+port + 1}`;

export default {
  updateFrequency: 10,  // in minutes
  maxHeight: 400, // in pixels
  onTabClick: () => setTimeout(() => console.log('calledeeeeeeeeeeeeeeeeeeee'), 500),
  sources: [{
  	  title: 'Alerts',
  	  url: `${url}/alerts?_sort=updated&_order=DESC`,
      skipEventsUntilXDaysBeforeStart: 1,
      allowTracking: true,
      showInAllTab: true,
      captureTags: [{
          tag: 'pu',
          title: 'Product Update'
        }, {
          tag: 'known_issue',
          title: 'Known Issues'
      }],
      archive: {
        after: 1,   // days
        url: `${url}/alerts/`,
        data: {     // any additional data to pass when submitting request to archive article
        }
      }
    }, {
	    title: 'Resources',
  	  url: `${url}/featured?_sort=updated&_order=DESC`,
      captureTags: [{
          tag: 'pu',
          title: 'Product Update'
        }, {
          tag: 'known_issue',
          title: 'Known Issues'
      }]
    }, {
	    title: 'Discussions',
  	  url: `${url}/discussions?_sort=updated&_order=DESC`,
      captureTags: [{
          tag: 'pu',
          title: 'Product Update'
        }, {
          tag: 'known_issue',
          title: 'Known Issues'
      }]
  }],
};
