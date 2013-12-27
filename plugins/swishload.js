svgManoeuvre.plugins.swishLoad = {
	init: function () {
		svgManoeuvre.swishLoad = false;
		
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
		svgManoeuvre.svgMove = false;
		if (svgManoeuvre.isDescendant(svgManoeuvre.svgElement, evt.target)) {
			svgManoeuvre.swishLoad = true;
			console.log(evt.target);
			var title = (evt.target.getAttribute('data-swipetitle'));
			if (title) {
				console.log(title);
				console.log(evt.target.tagName);
			}
		}
	},
	dragendHandler: function (evt) {
		if (svgManoeuvre.swishLoad) {
			alert('load up for ' + evt.gesture.direction);
		}
	},
};