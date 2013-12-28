svgManoeuvre.plugins.swishLoad = {
	init: function (callbacks) {
		svgManoeuvre.swishLoad = false;
		this.callbacks = callbacks;
		this.dataStores = Object.keys(this.callbacks);
		//console.log(this.dataStores);
		
		if(svgManoeuvre.plugins.tapManager) {
			console.log('SwishlySelect has found TapManager');
			
			
		}
		//overwrite start handlers for transforms to only activate when there is no call for swish loading
		svgManoeuvre.gestureHandlers.touch = this.startHandler;
		svgManoeuvre.gestureHandlers.dragstart = this.startHandler;
		svgManoeuvre.gestureHandlers.transformstart = this.startHandler;
		
		svgManoeuvre.gestureHandlers.release = this.releaseHandler;
		
		//adds extra handler for hold
		svgManoeuvre.gestureHandlers.hold = this.holdHandler;
		svgManoeuvre.gestureHandlers.dragend = this.dragendHandler;
	},
	HEADINGS: ['up', 'left', 'right', 'down']; //put in the correct order for iterating through to set up menu
	template: 'string',
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
		var target = evt.target;
		var targetData = false;
		
		
		if (svgManoeuvre.isDescendant(svgManoeuvre.svgElement, target)) {
			svgManoeuvre.swishLoad = true;
			
			//optional as can cause screen to freeze for no reason
			svgManoeuvre.svgMove = false;
			
			var targetData = self.checkStores(target, self.dataStores);
			if(targetData) {
				//fetch data specific call back from callbacks
				var callbackItem = self.callbacks[targetData.dataName];
				
				//execute callback for hold
				var popUpTitle = callbackItem['hold'](targetData.dataValue) || {title:targetData.dataValue};
				console.log(popUpTitle);
				var tm = svgManoeuvre.plugins.tapManager;
				var slides = ['up', 'left', 'right', 'down'];
				for (i=0; i<slides.length; i++) {
					//need to include test exists;
					tm.callbacks['swishly-' + slides[i]] = callbackItem[slides[i]];
				}
				
			}
		}
		if (targetData) {
			self.lastData = targetData
		}
	},
	dragendHandler: function (evt) {
		if (svgManoeuvre.swishLoad) {
			var self = svgManoeuvre.plugins.swishLoad;
			var targetData = self.lastData;
			if (targetData) {
				if(self.callbacks[targetData.dataName][evt.gesture.direction]) {
					self.callbacks[targetData.dataName][evt.gesture.direction](targetData.dataValue);
				}
			}
		}
	},
	addSwishly: function (elementCallback) {
		// requires tap Manager
		var tm = svgManoeuvre.plugins.tapManager;
		var directions = this.HEADINGS;
		for (i=0; i<directions.length; i++) {
			var direction = directions[i];
			tm.callbacks['swishly-' + direction] = elementCallback[direction] || null;
		}
	},
	clearSwishly: function () {
	
	},
	checkStores: function (element, storeNames) {
		for (i=0; i<storeNames.length; i++) {
			var dataName = storeNames[i];
			var dataValue = element.getAttribute('data-' + dataName);
			if (dataValue) {
				return {dataName: dataName, dataValue: dataValue};
			}
		}
		return false;
	},
	executeStores: function (element, storeNames) {
		for (i=0; i<storeLocations.length; i++) {
			var name = storeNames[i]
			var value = element.getAttribute('data-' + name);
			if (value) {
				this.callbacks[name]['hold'](vale);
			}
		}
	},
	buildMenu: function () {},
	showMenu: function () {},
};