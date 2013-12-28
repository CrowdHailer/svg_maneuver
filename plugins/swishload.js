svgManoeuvre.plugins.swishLoad = {
	init: function () {
		svgManoeuvre.swishLoad = false;
		
		this.dataTitle = Object.keys(this.callbackFunctions);
		
		//overwrite start handlers for transforms to only activate when there is no call for swish loading
		svgManoeuvre.gestureHandlers.touch = this.startHandler;
		svgManoeuvre.gestureHandlers.dragstart = this.startHandler;
		svgManoeuvre.gestureHandlers.transformstart = this.startHandler;
		
		svgManoeuvre.gestureHandlers.release = this.releaseHandler;
		
		//adds extra handler for hold
		svgManoeuvre.gestureHandlers.hold = this.holdHandler;
		svgManoeuvre.gestureHandlers.dragend = this.dragendHandler;
	},
	startHandler: function (evt) {
		if (!svgManoeuvre.swishLoad) {
			svgManoeuvre.startMove(evt);
		}
	},
	releaseHandler: function (evt) {
		svgManoeuvre.svgMove = false;
		svgManoeuvre.swishLoad = false;
	},
	holdHandler: function (evt) {
		var self = svgManoeuvre.plugins.swishLoad;
		svgManoeuvre.svgMove = false;
		if (svgManoeuvre.isDescendant(svgManoeuvre.svgElement, evt.target)) {
			svgManoeuvre.swishLoad = true;
			var target = evt.target;
			for (i = 0; i < self.dataTitle.length; i++) {
				var identifier = target.getAttribute('data-' + self.dataTitle[i]);
				if (identifier) {
					self.callbackFunctions[self.dataTitle[i]](identifier);
					break;
				}
			}
			identifier = identifier || 'DEFAULT';
		}
	},
	dragendHandler: function (evt) {
		if (svgManoeuvre.swishLoad) {
			alert('load up for ' + evt.gesture.direction);
		}
	},
	dataTitle: [],
	callbackFunctions: {
		station: function (data) {
			console.log('smells' + data);
		},
		line: function (data) {
			console.log('boooom' + data);
		}
	},
	buildMenu: function () {},
	showMenu: function () {},
	directionCallback: function (data) {}
};