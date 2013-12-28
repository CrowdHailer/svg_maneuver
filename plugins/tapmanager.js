svgManoeuvre.plugins.tapManager = {
	init: function (callbacks) {
		svgManoeuvre.gestureHandlers.tap = this.tapHandler;
	},
	tapHandler: function (evt) {
		console.log(evt.target);
	}
};