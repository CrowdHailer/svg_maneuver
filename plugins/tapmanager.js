svgManoeuvre.plugins.tapManager = {
	init: function (callbacks) {
		svgManoeuvre.gestureHandlers.tap = this.tapHandler;
		this.callbacks = callbacks;
		//console.log(this);
	},
	tapHandler: function (evt) {
		var id = evt.target.id || 'DEFAULT';
		//console.log(this);
		svgManoeuvre.plugins.tapManager.callbacks[id](evt);
		
		
		//console.log(Object.keys(evt.target));
	}
};