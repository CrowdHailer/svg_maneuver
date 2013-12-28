svgManoeuvre.plugins.swishLoad = {
	init: function (callbacks) {
		svgManoeuvre.swishLoad = false;
		this.callbacks = callbacks;
		this.dataStores = Object.keys(this.callbacks);
		
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
			for (i = 0; i < self.dataStores.length; i++) {
				var identifier = target.getAttribute('data-' + self.dataStores[i]);
				if (identifier) {
					self.callbackFunctions[self.dataStores[i]](identifier);
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
	checkStores: function (element, storeNames) {
		for (i=0; i<storeLocations.length; i++) {
			var dataName = storeNames[i];
			var dataValue = element.getAttribute('data-' + dataName);
			if (dataValue) {
				return {dataName: dataName, dataValue: dataValue};
			}
			else {
				return false;
			}
		}
	},
	executeStores: function (element, storeNames) {
		for (i=0; i<storeLocations.length; i++) {
			var name = storeNames[i]
			var value = element.getAttribute('data-' + name);
			if (value) {
				this.callbacks[name]['hold'](vale);
			}
		}
	}
	buildMenu: function () {},
	showMenu: function () {},
	directionCallback: function (data) {}
};