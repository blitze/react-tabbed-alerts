export default {
	get: function(k) {
		try {
			return JSON.parse(window.localStorage.getItem(k));
		} catch (e) {
			return e;
		}
	},
	set: function(k, v) {
		window.localStorage.setItem(k, JSON.stringify(v));
	},
};
